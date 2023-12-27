"use client";

import React, { use } from "react";
import ReactPlayer from "react-player";
import { useState, useEffect, useRef } from "react";
import {
  Fullscreen,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { formatTime } from "@/lib/format";
import screenfull from "screenfull";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlayerProps {
  src: string;
  autoPlay?: boolean;
  onEnd?: () => void;
}

export default function Player({ src, autoPlay, onEnd }: PlayerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay || false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);
  const [volume, setVolume] = useState(0.7);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [ready, setReady] = useState(false);

  const handleClickFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(document.querySelector(".video-player") as HTMLElement);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div className="relative video-player aspect-video">
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="w-10 h-10 text-secondary animate-spin" />
        </div>
      )}
      <ReactPlayer
        onReady={() => {
          setReady(true)
          autoPlay && setIsPlaying(true)
        }}
        url={src}
        width={"100%"}
        height={"100%"}
        playing={isPlaying}
        ref={playerRef}
        onProgress={({ playedSeconds }) => {
          setCurrentTime(playedSeconds);
        }}
        onDuration={(duration) => {
          setDuration(duration);
        }}
        volume={volume}
        onEnded={async () => {
          setIsPlaying(false);
          if (onEnd) {
            onEnd();
          }
        }}
        playbackRate={speed}
      />
      <div className="absolute bottom-0 left-0 w-full h-10 bg-black/60 toolbar">
        <div className="flex flex-col h-full gap-y-1">
          <div className="block h-1 bg-white/10">
            <Slider
              value={[currentTime]}
              max={duration}
              className="bg-white/40 time-slider"
              step={0.01}
              onValueChange={(val) => {
                setCurrentTime(val[0]);
                playerRef.current?.seekTo(val[0]);
              }}
              onValueCommit={(val) => {
                setCurrentTime(val[0]);
                playerRef.current?.seekTo(val[0]);
              }}
            />
          </div>
          <div className="flex items-center gap-x-3 text-white mx-2 h-full">
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            <span className="text-sm min-w-[90px] font-mono">
              {formatTime(currentTime)}
              <span className="mx-1">:</span>
              {formatTime(duration)}
            </span>
            <button
              onClick={() => {
                if (volume === 0) {
                  setVolume(0.7);
                } else {
                  setVolume(0);
                }
              }}
            >
              {volume > 0.5 && <Volume2 className="h-5 w-5" />}
              {volume > 0 && volume <= 0.5 && <Volume1 className="h-5 w-5" />}
              {volume === 0 && <VolumeX className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-x-3 min-w-[6rem]">
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={(val) => setVolume(val[0])}
                className="bg-white/10 audio-slider"
              />
            </div>
            <div className="ml-auto flex items-center gap-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>{speed}x</button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end">
                  <DropdownMenuRadioGroup
                    value={`${speed}`}
                    onValueChange={(val) => setSpeed(parseFloat(val))}
                  >
                    <DropdownMenuRadioItem value={`0.5`}>
                      0.5x
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={`1`}>
                      1x
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={`1.5`}>
                      1.5x
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={`1.75`}>
                      1.75x
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value={`2`}>
                      2x
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={() => {
                  handleClickFullscreen();
                  setIsFullscreen(!isFullscreen);
                }}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
