import { useState, useEffect, useMemo, useRef } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { useInView } from 'react-intersection-observer';
import Tippy from '@tippyjs/react';

import SoundCard from '~/components/SoundCard';

import soundData from '~/static-data/sounds';


export default function Index() {
    const [bookmarkLoaded, setBookmarkLoaded] = useState(false);
    const [bookmarkedSounds, setBookmarkedSounds] = useState([]);
    const [sounds, setSounds] = useState(soundData);
    const [reorderMode, setReorderMode] = useState(false);
    const [soundsPlaying, setSoundsPlaying] = useState([]);
    const [beginConf, setBeginConf] = useState(false);
    const [confirmRemoveBookmarks, setConfirmRemoveBookmarks] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(2);
    const secondsLeftRef = useRef(null);
    const { ref, inView, entry } = useInView({
        threshold: 0.01
    });
    

    /* 
        Effect:

        Get bookmarked sounds from local storage.
    */
    useEffect(() => {
        let bookmarkedSounds = JSON.parse(localStorage.getItem('bookmarkedSounds'));

        if (bookmarkedSounds && bookmarkedSounds.length) {
            setSounds((sounds) => {
                let newSounds = [...sounds];

                for (let idx of bookmarkedSounds) {
                    newSounds[idx].isBookmarked = true;
                }

                return newSounds;
            });

            setBookmarkedSounds(bookmarkedSounds);
        }
        setBookmarkLoaded(true);
    }, []);

    const toggleBookmarked = (idx) => {
        if (sounds[idx].isBookmarked) {
            setBookmarkedSounds((bookmarkedSounds) => {
                let newSounds = [...bookmarkedSounds];

                newSounds.splice(newSounds.findIndex((val) => val == idx), 1);
                localStorage.setItem('bookmarkedSounds', JSON.stringify(newSounds));
                return newSounds;
            });

            setSounds((sounds) => {
                let newSounds = [...sounds];

                newSounds[idx].isBookmarked = false;
                return newSounds;
            })
        }
        else {
            setBookmarkedSounds((bookmarkedSounds) => {
                let newSounds = [...bookmarkedSounds, idx];
                
                localStorage.setItem('bookmarkedSounds', JSON.stringify(newSounds));
                return newSounds;
            });
    
            setSounds((sounds) => {
                let newSounds = [...sounds];
    
                newSounds[idx].isBookmarked = true;
                return newSounds;
            });
        }
    };

    const addSoundPlaying = (idx) => {
        setSoundsPlaying((soundsPlaying) => {
            let newSoundsPlaying = [...soundsPlaying];

            newSoundsPlaying.push(idx);
            return newSoundsPlaying;
        })
    };

    const removeSoundPlaying = (idx) => {
        setSoundsPlaying((soundsPlaying) => {
            let newSoundsPlaying = [...soundsPlaying];
            let oldIdx = newSoundsPlaying.findIndex((val) => val == idx);

            newSoundsPlaying.splice(oldIdx, 1);
            return newSoundsPlaying;
        })
    };

    const onSortStart = ({ node }) => {
        document.documentElement.style.pointerEvents = 'none';
        document.documentElement.style.cursor = 'grab';
    }

    const onSortEnd = ({ oldIndex, newIndex, node, e }) => {
        setBookmarkedSounds((bookmarkedSounds) => {
            let newSounds = [...bookmarkedSounds];
            let oldVal = newSounds[oldIndex];

            newSounds.splice(oldIndex, 1);
            newSounds.splice(newIndex, 0, oldVal);
            localStorage.setItem('bookmarkedSounds', JSON.stringify(newSounds));
            return newSounds;
        });

        document.documentElement.style.pointerEvents = null;
        document.documentElement.style.cursor = null;
    };

    const SortableItem = SortableElement(({ value }) => (
        <SoundCard {...sounds[value]} toggleBookmarked={() => toggleBookmarked(value)} reorderMode={reorderMode} />
    ));

    const SortableList = SortableContainer(({ items }) => (
        <div className="home-c-bookmarked-sounds-grid w-full">
        {
            items.map((soundIdx, idx) => (
                <SortableItem value={soundIdx} index={idx} key={sounds[soundIdx].title} />
            ))
        }
        </div>
    ));

    const angy = useMemo(() => {
        let hasSoundsPlaying = soundsPlaying.length;
        
        if (hasSoundsPlaying) {
            for (let sound of soundsPlaying) {
                if (sounds[sound].isHappy) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }, [soundsPlaying.length, soundsPlaying]);

    const removeButtonClick = () => {
        if (!beginConf) {
            setBeginConf(true);
            secondsLeftRef.current = setInterval(() => {
                setSecondsLeft((secondsLeft) => secondsLeft - 1);
            }, [1000]);
        }
        else {
            clearInterval(secondsLeftRef.current);
            secondsLeftRef.current = null;
            setBeginConf(false);
            setSecondsLeft(2);
            setBookmarkedSounds([]);
            setSounds((sounds) => {
                let newSounds = [...sounds];

                for (let soundIdx of bookmarkedSounds) {
                    newSounds[soundIdx].isBookmarked = false;
                }
                return newSounds;
            })
            localStorage.setItem('bookmarkedSounds', '[]');
        }
    }

    useEffect(() => {
        if (secondsLeft == 0) {
            clearInterval(secondsLeftRef.current);
            secondsLeftRef.current = null;
            setTimeout(() => {
                setBeginConf(false);
                setSecondsLeft(2);
            }, [1000]);
        }
    }, [secondsLeft]);

    return (
        <main className="py-20">
            <header className="relative z-10 flex flex-col items-center space-y-6 text-center">
                <h1 className="home-c-main-heading px-4">The Sounds of Terence Fletcher</h1>
                <img src="/img/drumsticks.png" alt="Drumsticks" />
                <p className="home-c-main-description px-4">
                    This is a soundboard of Terence Fletcher, the slightly problematic yet most badass character from the movie <em>Whiplash</em>. 
                    There are also guest sound appearances by Andrew Neiman.
                </p>
                <div className="absolute top-[110%] xl:top-[120%] w-[80%] max-w-[250px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[500px] mx-auto flex flex-col">
                    <p className="max-w-[250px] xs:max-w-[300px] xl:text-lg font-serif italic font-bold text-left">There are no two words in the English language more harmful than 'good job'.</p>
                    <p className="max-w-[250px] xs:max-w-[300px] mt-8 xl:text-lg self-end font-serif italic font-bold text-right">But is there a line, you know, maybe you go too far and you discourage the next Charlie Parker from ever becoming Charlie Parker?</p>
                    <p className="max-w-[250px] xs:max-w-[300px] mt-8 xl:text-lg font-serif italic font-bold text-left">No man, no, because the next Charlie Parker would never be discouraged.</p>
                    <p className="max-w-[250px] xs:max-w-[300px] mt-4 xl:text-lg self-end font-serif italic font-bold text-right">Yeah.</p>
                </div>

            </header>
            <div className="home-c-animation-section sticky top-[35%] xl:top-[20%] flex justify-between items-center overflow-hidden">
                <img className={`home-c-animation-img transition-transform duration-200 ease-in-out ${inView && '-translate-x-1/2 3xl:translate-x-0'} w-[20%] xl:w-[30%] 2xl:w-[25%]`} src={`/img/terence-fletcher${angy ? '-angry' : ''}.png`} alt="Terence Fletcher" />
                <img className={`home-c-animation-img transition-transform duration-200 ease-in-out ${inView && 'translate-x-1/2 3xl:translate-x-0'} w-[20%] xl:w-[30%] 2xl:w-[25%]`} src={`/img/andrew-neiman${angy ? '-angry' : ''}.png`} alt="Andrew Neiman" />
            </div>
            <div className="home-c-content-wrapper z-10" ref={ref} id="top">
                <section className="pt-96 xs:pt-80 sm:pt-64 lg:pt-48 xl:pt-12">
                    <header className="mb-8">
                        <h2 className="text-4xl text-center">Bookmarked Sounds</h2>
                    </header>
                    <div className="relative px-4">
                        {
                            !bookmarkLoaded ? (
                                <div className="flex flex-col items-center">
                                    <div className="home-c-bookmarked-loader"></div>
                                    <h3 className="mt-4 text-3xl">Loading...</h3>
                                </div>
                            ) : (
                                !(!!bookmarkedSounds.length) ? (
                                    <div className="max-w-[800px] p-5 sm:p-3 mx-auto bg-slate-400 rounded-md shadow-xl">
                                        <p className="text-white text-center text-lg font-bold">
                                            You currently don't have any bookmarked sounds. Click on the
                                            <svg className="w-6 h-6 inline-block mx-2 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                            icon in the sound card that you want to bookmark for more convenient usage. These bookmarks will persist on your device until your browser cache is cleared.</p>
                                    </div>
                                ) : (
                                    <div className="max-w-[850px] mx-auto p-4 pt-8 bg-slate-400 rounded-md shadow-xl flex flex-col items-center">
                                        {
                                            <div className="flex space-x-3">
                                                <Tippy 
                                                disabled={reorderMode}
                                                content={<span className="font-bold text-sm">In this mode, you can drag the cards around to get the order you want for convenient usage.</span>}>
                                                    <button 
                                                    className="home-c-reorder-button text-white cursor-pointer block text-center px-4 py-2 shadow-xl font-bold rounded-md mb-5"
                                                    onClick={() => setReorderMode((reorderMode) => !reorderMode)}
                                                    ><span className="relative z-10">{reorderMode ? 'Turn off Reorder Mode' : 'Turn on Reorder Mode'}</span></button>
                                                </Tippy>
                                                <Tippy 
                                                content={<span className="font-bold text-sm">This cannot be undone. Use with caution :)</span>}>
                                                    <button 
                                                    onClick={removeButtonClick}
                                                    className="home-c-remove-button text-black cursor-pointer block text-center px-4 py-2 shadow-xl font-bold rounded-md mb-5"
                                                    ><span className="relative z-10">{beginConf ? `Click To Confirm (${secondsLeft})` : 'Remove All Bookmarks'}</span></button>
                                                </Tippy>
                                            </div>
                                        }
                                        {
                                            reorderMode ? (
                                                <SortableList items={bookmarkedSounds} axis="xy" onSortEnd={onSortEnd} onSortStart={onSortStart} />
                                            ) : (
                                                <div className="home-c-bookmarked-sounds-grid w-full">
                                                {
                                                    bookmarkedSounds.map((value) => (
                                                        <SoundCard 
                                                        {...sounds[value]} 
                                                        toggleBookmarked={() => toggleBookmarked(value)} 
                                                        key={sounds[value].title} 
                                                        reorderMode={reorderMode} 
                                                        addSoundPlaying={() => addSoundPlaying(value)} 
                                                        removeSoundPlaying={() => removeSoundPlaying(value)} />
                                                    ))
                                                }
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            )
                        }
                    </div>
                </section>
                <section className="mt-12">
                    <header className="mb-8">
                        <h2 className="text-4xl text-center">All Sounds</h2>
                    </header>
                    <div className="home-c-sounds-grid">
                        {
                            soundData.map((sound, idx) => (
                                <SoundCard {...sound} key={sound.title} toggleBookmarked={() => toggleBookmarked(idx)} addSoundPlaying={() => addSoundPlaying(idx)} removeSoundPlaying={() => removeSoundPlaying(idx)} />
                            ))
                        }
                    </div>
                </section>
            </div>
            {
                inView && (
                    <div>
                        <div className="block xl:hidden">
                            <Tippy content={<span className="text-white text-lg font-bold">Go to Top</span>}>
                                <a href="#top" className="fixed bottom-3 sm:bottom-5 right-3 sm:right-5 flex items-center space-x-3 rounded-2xl p-2 bg-black">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" stroke="white" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                                    </svg>
                                </a>
                            </Tippy>
                        </div>
                        <div className="hidden xl:block">
                            <a href="#top" className="fixed bottom-5 right-5 flex items-center space-x-3 rounded-2xl px-3 py-2 bg-black">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" stroke="white" strokeLinejoin="round" strokeWidth={2} d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                                </svg>
                                <span className="text-white text-xl font-bold">Go to Top</span>
                            </a>
                        </div>
                    </div>

                )
            }

        </main>
    );
}
