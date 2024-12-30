"use client";

import React, { useState, useRef, useCallback, FormEvent, KeyboardEvent, useEffect } from "react";
import { Paperclip, Send, ImageIcon, StopCircle, Mic, X, ChevronUp, Figma } from 'lucide-react';
import { useDropzone } from "react-dropzone";
// @ts-ignore
import MicRecorder from "mic-recorder-to-mp3";

interface CommonFormProps {
  value: string;
  loading: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFormSubmit?: (event: FormEvent<HTMLFormElement>, files?: File[]) => void;
  onResetForm?: () => void;
}

export const CommonForm: React.FC<CommonFormProps> = ({
  value,
  loading,
  onInputChange,
  onFormSubmit,
  onResetForm,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const recorder = useRef(new MicRecorder({ bitRate: 128 }));
  const [textFileContent, setTextFileContent] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyPress = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (textareaRef.current) {
          onFormSubmit?.(
            event as unknown as FormEvent<HTMLFormElement>,
            [imageFile, audioFile].filter(Boolean) as File[]
          );
          onResetForm?.();
        }
      }
    },
    [onFormSubmit, imageFile, audioFile]
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'text/plain' || file.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (textareaRef.current) {
            textareaRef.current.value = textareaRef.current.value + " " + (e.target?.result as string | null);
          }
          setTextFileContent(e.target?.result as string | null);
        };
        reader.readAsText(file);
        setImageFile(file); // Still store the file itself
        setImagePreviewUrl(null); // Clear image preview if any
      } else { // Handle image/other files as before
        setImageFile(file);
        setImagePreviewUrl(URL.createObjectURL(file));
        setTextFileContent(null); // Clear text preview
      }
    }
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
      "text/plain": [],
      "application/json": [],
    },
    multiple: false,
    noClick: true,
  });

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onFormSubmit?.(e, [imageFile, audioFile].filter(Boolean) as File[]);
    },
    [onFormSubmit, imageFile, audioFile]
  );

  const startRecording = async () => {
    try {
      await recorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    setRecording(false);
    try {
      const [, blob] = await recorder.current.stop().getMp3();
      const audioFile = new File([blob], "recording.mp3", {
        type: "audio/mp3",
      });
      setAudioFile(audioFile);

      setTimeout(() => {
        formRef.current?.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true })
        );
      }, 100);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Chat Form */}
      <div {...getRootProps()} className="p-4">
        <div className="max-w-3xl mx-auto border border-white rounded-lg">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative"
          >
            <input {...getInputProps()} className="hidden" />
            <div className="flex items-end space-x-2 bg-zinc-800 rounded-lg p-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={open}
                  className="text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  <Figma className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={recording ? stopRecording : startRecording}
                  className={`transition-colors ${recording
                    ? "text-red-500 hover:text-red-400"
                    : "text-zinc-400 hover:text-zinc-300"
                    }`}
                >
                  {recording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={value}
                onChange={onInputChange}
                onKeyDown={handleKeyPress}
                rows={2}
                className="flex-grow bg-transparent border-0 resize-none focus:ring-0 focus:outline-none text-zinc-200 placeholder-zinc-500 text-sm p-0"
                placeholder="Send a message..."
                style={{ minHeight: '24px', maxHeight: '200px' }}
              />

              <button
                type="submit"
                disabled={loading}
                className="text-zinc-400 hover:text-zinc-300 transition-colors disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            {textFileContent && (
              <div className="mt-4 bg-zinc-800 rounded-md p-2 overflow-auto max-h-40">
                <pre className="text-zinc-200 whitespace-pre-wrap">{textFileContent}</pre>
              </div>
            )}

            {(imagePreviewUrl || audioFile) && (
              <div className="mt-4 flex gap-2">
                {imagePreviewUrl && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="max-w-xs max-h-40 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreviewUrl(null)}
                      className="absolute top-1 right-1 bg-zinc-900/80 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-zinc-400" />
                    </button>
                  </div>
                )}
                {audioFile && (
                  <div className="relative inline-block bg-zinc-800 rounded-md p-2">
                    <audio src={URL.createObjectURL(audioFile)} controls className="h-10" />
                    <button
                      type="button"
                      onClick={() => setAudioFile(null)}
                      className="absolute -top-1 -right-1 bg-zinc-900/80 rounded-full p-1"
                    >
                      <X className="h-4 w-4 text-zinc-400" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-32 right-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-full p-2 transition-colors"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

