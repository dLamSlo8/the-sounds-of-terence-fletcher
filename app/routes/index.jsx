import { useState, useEffect } from 'react';

import SoundCard from '~/components/SoundCard';

import soundData from '~/static-data/sounds';


export default function Index() {
    const [bookmarkLoaded, setBookmarkLoaded] = useState(false);
    const [bookmarkedSounds, setBookmarkedSounds] = useState([]);
    const [sounds, setSounds] = useState(soundData);

    /* 
        Effect:

        Get bookmarked sounds from local storage.
    */
    useEffect(() => {
        let bookmarkedSounds = JSON.parse(localStorage.getItem('bookmarkedSounds'));

        if (bookmarkedSounds) {
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

    return (
        <main className="py-20">
            <header className="flex flex-col items-center space-y-6 text-center">
                <h1 className="home-c-main-heading">The Sounds of Terence Fletcher</h1>
                <img src="/img/drumsticks.png" alt="Drumsticks" />
                <p className="home-c-main-description">
                    This is a soundboard of Terence Fletcher, the slightly problematic yet most badass character from the movie <em>Whiplash</em>. 
                    There are also guest sound appearances by Andrew Neiman.
                </p>
            </header>
            <section className="mt-12">
                <header className="mb-8">
                    <h2 className="text-4xl text-center">Bookmarked Sounds</h2>
                </header>
                <div className="px-4">
                    {
                        !bookmarkLoaded ? (
                            <div className="flex flex-col items-center">
                                <div className="home-c-bookmarked-loader"></div>
                                <h3 className="mt-4 text-3xl">Loading...</h3>
                            </div>
                        ) : (
                            !(!!bookmarkedSounds.length) ? (
                                <div className="max-w-[800px] p-3 mx-auto bg-slate-400 rounded-md shadow-xl">
                                    <p className="text-white text-center text-lg font-bold">
                                        You currently don't have any bookmarked sounds. Click on the 
                                        <svg className="w-6 h-6 inline-block mx-2 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        icon in the sound card that you want to bookmark for more convenient usage.</p> 
                                </div>
                            ) : (
                                <div className="home-c-bookmarked-sounds-grid bg-slate-400 rounded-md shadow-xl">
                                    {
                                        bookmarkedSounds.map((soundIdx) => (
                                            <SoundCard {...sounds[soundIdx]} key={sounds[soundIdx].title} toggleBookmarked={() => toggleBookmarked(soundIdx)} />
                                        ))
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
                            <SoundCard {...sound} key={sound.title} toggleBookmarked={() => toggleBookmarked(idx)} />
                        ))
                    }
                </div>
            </section>
        </main>
    );
}
