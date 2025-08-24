import { useRef, useState } from "react";
import type { Message } from "./types/message";
import Button from "./common/Button.tsx";
import classNames from "classnames";
import usePostSpeech from "./hooks/usePostSpeech";
import usePostTranscription from "./hooks/usePostTranscription";
import WelcomeView from "./components/WelcomeView.tsx";

let recorder: MediaRecorder | undefined;

function App() {
  const postSpeechMutation = usePostSpeech();
  const postTranscriptionMutation = usePostTranscription();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [hasStartedLesson, setHasStartedLesson] = useState(false);
  const [hasLessonEnded, setHasLessonEnded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [apiErrorMode, setApiErrorMode] = useState<
    "record" | "retry" | undefined
  >(undefined);
  const isRecordingCancelledRef = useRef(false);
  const selectedLessonsRef = useRef<string[]>([]);

  const handleSendUserInput = async (userInput?: string) => {
    setApiErrorMode(undefined);
    setIsInputDisabled(true);

    const lastAssistantMessage = messages
      .filter((m) => m.source === "assistant")
      .at(-1);

    try {
      const responseData = await postSpeechMutation.mutateAsync({
        previous_response_id: lastAssistantMessage?.id,
        user_input: userInput,
        lessons: selectedLessonsRef.current,
      });
      setMessages((prev) =>
        prev.concat({
          id: responseData.id,
          source: "assistant",
          entries: responseData.entries,
        })
      );
      if (responseData.isEndOfConversation) {
        setHasLessonEnded(true);
        return;
      }
    } catch {
      setApiErrorMode("retry");
      return;
    } finally {
      setIsInputDisabled(false);
    }
  };

  const handleRetry = () => {
    const lastUserInput = messages
      .filter((m) => m.source === "user")
      .at(-1)
      ?.entries?.at(-1)?.transcription;
    handleSendUserInput(lastUserInput);
  };

  const handleStartLesson = (lessonIds: string[]) => {
    selectedLessonsRef.current = lessonIds;
    setHasStartedLesson(true);
    handleSendUserInput();
  };

  const handleStartLessonAgain = () => {
    setHasLessonEnded(false);
    setMessages([]);
    setHasStartedLesson(false);
  };

  const handleFinishRecord = () => {
    recorder?.stop();
    setIsRecording(false);
  };

  const handleCancelRecord = () => {
    isRecordingCancelledRef.current = true;
    recorder?.stop();
    setIsRecording(false);
  };

  const handleRecord = async () => {
    setApiErrorMode(undefined);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    recorder = new MediaRecorder(stream);

    setIsRecording(true);

    let chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    recorder.onstop = async () => {
      if (isRecordingCancelledRef.current === true) {
        chunks = [];
        isRecordingCancelledRef.current = false;
        stream.getAudioTracks().forEach((track) => track.stop());
        return;
      }
      stream.getAudioTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: recorder?.mimeType });
      const url = URL.createObjectURL(blob);

      // Get transcript of audio
      const formData = new FormData();
      formData.append(
        "audio",
        blob,
        `${new URL(new URL(url).pathname).pathname.replaceAll("/", "")}.webm`
      );

      try {
        setIsInputDisabled(true);
        const responseData = await postTranscriptionMutation.mutateAsync(
          formData
        );
        const { transcription } = responseData;
        setMessages((prev) =>
          prev.concat({
            id: crypto.randomUUID(),
            source: "user",
            entries: [
              {
                type: "audio",
                src: url,
                transcription: transcription,
              },
            ],
          })
        );
        await handleSendUserInput(transcription);
      } catch {
        setApiErrorMode("record");
        return;
      } finally {
        setIsInputDisabled(false);
      }
    };

    recorder.onerror = () => {
      setIsRecording(false);
    };

    recorder.start();
  };

  return hasStartedLesson ? (
    <div className="p-4 flex flex-col gap-2">
      {apiErrorMode && (
        <div className="p-3 bg-red-100 rounded-md">
          Something went wrong. Please try again.
        </div>
      )}
      {messages.map(({ id: messageId, source, entries }) =>
        entries.map((entry, entryId) => (
          <div
            key={`${messageId}-${entryId}`}
            className={classNames([
              "p-3 flex flex-col gap-2 rounded-md max-w-full md:max-w-[50%]",
              source === "assistant"
                ? "self-start bg-assitant items-start"
                : "self-end bg-user items-end",
            ])}
          >
            <audio
              controls
              controlsList="nodownload"
              key={`${messageId}-${entryId}`}
              src={entry.src}
            />
            <details>
              <summary>Transcript</summary>
              {entry.transcription}
            </details>
          </div>
        ))
      )}
      <div className="flex flex-col mt-4 gap-2">
        {hasLessonEnded ? (
          <Button onClick={handleStartLessonAgain}>Start again</Button>
        ) : isRecording ? (
          <>
            <Button disabled={isInputDisabled} onClick={handleFinishRecord}>
              Finish recording
            </Button>
            <Button disabled={isInputDisabled} onClick={handleCancelRecord}>
              Cancel recording
            </Button>
          </>
        ) : (
          <Button
            disabled={isInputDisabled}
            onClick={apiErrorMode === "retry" ? handleRetry : handleRecord}
          >
            {isInputDisabled
              ? "Generating..."
              : apiErrorMode === "retry"
              ? "Retry"
              : "Record"}
          </Button>
        )}
      </div>
    </div>
  ) : (
    <WelcomeView handleStartLesson={handleStartLesson} />
  );
}

export default App;
