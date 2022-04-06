import { useRef, useState } from 'react';
import Tippy from '@tippyjs/react';


export default function SoundCard({
    title,
    transcript,
    file,
    isBookmarked,
    toggleBookmarked
}) {
    const [playing, setPlaying] = useState(false);
    const [paused, setPaused] = useState(false);
    const [showTranscript, setShowTranscript] = useState(false);

    const audioRef = useRef();
    const playRef = useRef();
    
    const handlePlay = () => {
        audioRef.current.play();
        setPlaying(true);
        setPaused(false);
    };

    const handlePause = () => {
        audioRef.current.pause();
        setPaused(true);
        setPlaying(false);
    }

    const handleRestart = () => {
        if (playing || paused) {
            audioRef.current.currentTime = 0;

            if (paused) {
                audioRef.current.play();
                setPaused(false);
                setPlaying(true);
            }
        }
    }

    const handleStop = () => {
        if (playing || paused) {
            audioRef.current.currentTime = 0;
            audioRef.current.pause();
            setPlaying(false);
            setPaused(false);
            playRef.current.focus();
        }
    }

    const handleAudioEnd = () => {
        setPlaying(false);
        setPaused(false);
        playRef.current.focus();
    }

    const toggleTranscript = () => {
        setShowTranscript((showTranscript) => !showTranscript);
    }

    return (
        <article className="c-sound-card relative h-0 pb-[100%] rounded-md bg-white">
            <div className="absolute inset-0 flex flex-col justify-center items-center p-5">
                <header className={`px-3 mb-6 ${showTranscript && 'max-h-[40%] overflow-auto'}`}>
                    {
                        showTranscript ? (
                            <>
                                <h2 className="absolute left-3 top-3 text-md card-breakpoint:max-w-[57%]">{title}</h2>
                                <p className="text-sm text-center">{transcript}</p>
                            </>
                        ) : (
                            <h2 className="text-xl text-center">{title}</h2>
                        )
                    }
                </header>
                <div className="absolute left-0 bottom-5 w-full flex justify-center gap-7">
                    <button className="c-sound-card__button flex flex-col items-center space-y-1 w-[34px]" onClick={playing ? handlePause : handlePlay} data-type="play" ref={playRef}>
                        {
                            playing ? (
                                <>
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-bold text-xs">PAUSE</p>
                                </>
                            ) : (
                                <>
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="font-bold text-xs">PLAY</p>
                                </>
                            )
                        }
                    </button>
                    <button 
                    className={`c-sound-card__button flex flex-col items-center space-y-1 ${!(playing || paused) && 'opacity-25 cursor-default'}`} 
                    onClick={handleRestart}
                    data-playing={playing}
                    tabIndex={!(playing || paused) ? -1 : 0}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <p className="font-bold text-xs">RESTART</p>
                    </button>
                    <button 
                    className={`c-sound-card__button flex flex-col items-center space-y-1 ${!(playing || paused) && 'opacity-25 cursor-default'}`} 
                    onClick={handleStop} 
                    data-playing={playing}
                    tabIndex={!(playing || paused) ? -1 : 0}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                        </svg>
                        <p className="font-bold text-xs">STOP</p>
                    </button>
                </div>
                <div className="absolute top-3 right-3 flex gap-3">
                    <Tippy content={<span className="font-bold text-xs">{showTranscript ? 'HIDE TRANSCRIPT' : 'SHOW TRANSCRIPT'}</span>} hideOnClick="false">
                        <button className="flex flex-col items-center space-y-1" onClick={toggleTranscript}>
                            {
                                showTranscript ? (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                )
                            }
                        </button>
                    </Tippy>
                    <Tippy content={<span className="font-bold text-xs">{isBookmarked ? 'UN-BOOKMARK' : 'BOOKMARK'}</span>} hideOnClick="false">
                        <button className="flex flex-col items-center space-y-1" onClick={() => toggleBookmarked({ title, transcript, file })}>
                            {
                                isBookmarked ? (
                                    <svg className="w-8 h-8" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                ) : (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                )
                            }
                        </button>
                    </Tippy>
                </div>
            </div>
            <audio src={`/sounds/${file}.mp3`} ref={audioRef} onEnded={handleAudioEnd}></audio>
        </article>
    )
}