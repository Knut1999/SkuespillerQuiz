import { useState, useRef, useMemo } from 'react'
import './Quiz.css'

const TOTAL_QUESTIONS = 10

const DIFFICULTIES = [
  {
    id: 'easy',
    label: 'Lett',
    desc: 'Tre navn å velge mellom — hvem er det?',
    color: '#4ade80',
  },
  {
    id: 'medium',
    label: 'Middels',
    desc: 'Velg navnet fra en lang liste med muligheter.',
    color: '#fbbf24',
  },
  {
    id: 'hard',
    label: 'Vanskelig',
    desc: 'Skriv navnet selv. Riktige bokstaver blir grønne.',
    color: '#f87171',
  },
]

/**
 * Celebrity dataset built from local photos in public/moviestars/.
 * Each filename is the celebrity's name, so the array is generated from disk.
 */
const CELEBS = [
  { name: 'Al Pacino', img: '/moviestars/Al Pacino.png' },
  { name: 'Anthony Hopkins', img: '/moviestars/Anthony Hopkins.png' },
  { name: 'Benedict Cumberbatch', img: '/moviestars/Benedict Cumberbatch.png' },
  { name: 'Brad Pitt', img: '/moviestars/Brad Pitt.png' },
  { name: 'Bryan Cranston', img: '/moviestars/Bryan Cranston.png' },
  { name: 'Charles Chaplin', img: '/moviestars/Charles Chaplin.png' },
  { name: 'Christian Bale', img: '/moviestars/Christian Bale.png' },
  { name: 'Christoph Waltz', img: '/moviestars/Christoph Waltz.png' },
  { name: 'Clint Eastwood', img: '/moviestars/Clint Eastwood.png' },
  { name: 'Colin Farrell', img: '/moviestars/Colin Farrell.png' },
  { name: 'Daniel Day-Lewis', img: '/moviestars/Daniel Day-Lewis.png' },
  { name: 'Denzel Washington', img: '/moviestars/Denzel Washington.png' },
  { name: 'Dustin Hoffman', img: '/moviestars/Dustin Hoffman.png' },
  { name: 'Dwayne Johnson', img: '/moviestars/Dwayne Johnson.png' },
  { name: "Dylan O'Brien", img: "/moviestars/Dylan O'Brien.png" },
  { name: 'Edward Norton', img: '/moviestars/Edward Norton.png' },
  { name: 'George Clooney', img: '/moviestars/George Clooney.png' },
  { name: 'Jack Nicholson', img: '/moviestars/Jack Nicholson.png' },
  { name: 'Javier Bardem', img: '/moviestars/Javier Bardem.png' },
  { name: 'Jim Carrey', img: '/moviestars/Jim Carrey.png' },
  { name: 'Joaquin Phoenix', img: '/moviestars/Joaquin Phoenix.png' },
  { name: 'Leonardo DiCaprio', img: '/moviestars/Leonardo DiCaprio.png' },
  { name: 'Matt Damon', img: '/moviestars/Matt Damon.png' },
  { name: 'Meryl Streep', img: '/moviestars/Meryl Streep.png' },
  { name: 'Morgan Freeman', img: '/moviestars/Morgan Freeman.png' },
  { name: 'Robert De Niro', img: '/moviestars/Robert De Niro.png' },
  { name: 'Robert Downey Jr', img: '/moviestars/Robert Downey Jr.png' },
  { name: 'Robin Williams', img: '/moviestars/Robin Williams.png' },
  { name: 'Ryan Gosling', img: '/moviestars/Ryan Gosling.png' },
  { name: 'Samuel L. Jackson', img: '/moviestars/Samuel L. Jackson.png' },
  { name: 'Scarlett Johansson', img: '/moviestars/Scarlett Johansson.png' },
  { name: 'Sean Penn', img: '/moviestars/Sean Penn.png' },
  { name: 'Tom Cruise', img: '/moviestars/Tom Cruise.png' },
  { name: 'Tom Hanks', img: '/moviestars/Tom Hanks.png' },
  { name: 'Tom Hiddleston', img: '/moviestars/Tom Hiddleston.png' },
  { name: 'Will Smith', img: '/moviestars/Will Smith.png' },
]

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function CelebrityQuiz() {
  const [screen, setScreen] = useState('home') // home | playing | results
  const [difficulty, setDifficulty] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [guess, setGuess] = useState('')
  const [isCorrect, setIsCorrect] = useState(null)
  const [mediumNames, setMediumNames] = useState([])
  const inputRef = useRef(null)

  // Generate questions on difficulty select
  const startGame = (diff) => {
    setDifficulty(diff)
    setQuestions(shuffle(CELEBS).slice(0, TOTAL_QUESTIONS))
    setMediumNames(shuffle(CELEBS.map((c) => c.name)))
    setCurrentQ(0)
    setScore(0)
    setAnswered(false)
    setGuess('')
    setIsCorrect(null)
    setScreen('playing')
    setTimeout(() => inputRef.current?.focus(), 300)
  }

  const handleEasySelect = (selectedName) => {
    if (answered) return
    setAnswered(true)
    const correct = selectedName === questions[currentQ].name
    if (correct) setScore((s) => s + 1)
    setIsCorrect(correct)
  }

  const handleMediumSelect = (selectedName) => {
    if (answered) return
    setAnswered(true)
    const correct = selectedName === questions[currentQ].name
    if (correct) setScore((s) => s + 1)
    setIsCorrect(correct)
  }

  const handleHardSubmit = () => {
    if (answered) return
    setAnswered(true)
    const correct =
      guess.trim().toLowerCase() ===
      questions[currentQ].name.toLowerCase().replace(/\./g, '')
    if (correct) setScore((s) => s + 1)
    setIsCorrect(correct)
  }

  const handleHardKeyDown = (e) => {
    if (e.key === 'Enter' && guess.trim() && !answered) {
      e.preventDefault()
      handleHardSubmit()
    }
  }

  const nextQuestion = () => {
    if (currentQ + 1 >= TOTAL_QUESTIONS) {
      setScreen('results')
    } else {
      setCurrentQ((q) => q + 1)
      setAnswered(false)
      setGuess('')
      setIsCorrect(null)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }

  const handleHardChange = (e) => {
    if (answered) return
    setGuess(e.target.value)
  }

  // --- Render helpers ---

  // Memoized so option order stays stable across re-renders (e.g. after answering)
  const easyOptions = useMemo(() => {
    if (!questions.length) return []
    const target = questions[currentQ]
    const wrong = shuffle(CELEBS.filter((c) => c.name !== target.name)).slice(0, 2)
    return shuffle([...wrong, { name: target.name }])
  }, [questions, currentQ])

  const renderEasyOptions = () => {
    const target = questions[currentQ]

    return (
      <div className="easy-options">
        {easyOptions.map((opt, idx) => {
          let classNames = 'easy-option-btn'
          if (answered) {
            if (opt.name === target.name) classNames += ' correct'
            else classNames += ' wrong'
          }
          return (
            <button
              key={idx}
              className={classNames}
              onClick={() => handleEasySelect(opt.name)}
              disabled={answered}
            >
              {opt.name}
            </button>
          )
        })}
      </div>
    )
  }

  const renderMediumList = () => {
    const target = questions[currentQ]

    return (
      <ul className="medium-list">
        {mediumNames.map((name, idx) => {
          let classNames = ''
          if (answered) {
            if (name === target.name) classNames = 'selected correct'
            else classNames = 'selected'
          }
          return (
            <li
              key={idx}
              className={classNames}
              onClick={() => handleMediumSelect(name)}
              style={{ cursor: answered ? 'default' : 'pointer' }}
            >
              {name}
            </li>
          )
        })}
      </ul>
    )
  }

  const renderHardInput = () => {
    const target = questions[currentQ].name.toLowerCase().replace(/\./g, '')

    const getLetterClass = (i) => {
      if (!answered) return 'letter-neutral'
      const targetChar = target[i]
      const guessChar = guess.toLowerCase().replace(/\./g, '')[i]
      if (!guessChar) return 'letter-neutral'
      if (guessChar === targetChar) return 'letter-correct'
      return 'letter-wrong'
    }

    // Show the actual target word after answering, with each letter colored:
    //   green  = the guess had the right letter in this position
    //   red    = the guess had a wrong letter in this position
    //   neutral = the guess was shorter (no letter typed here)
    if (answered) {
      const displayLetters = target.split('').map((ch, i) => (
        <span key={i} className={`guess-letter ${getLetterClass(i)}`}>
          {ch}
        </span>
      ))
      return (
        <div className="guess-input-wrapper">
          <div className="guess-letters">{displayLetters}</div>
        </div>
      )
    }

    // During typing: just the input, with live letter coloring
    const typed = guess.toLowerCase().replace(/\./g, '')
    const displayLetters = target.split('').map((_, i) => {
      const lc = typed[i]
      let cls = 'letter-neutral'
      if (lc && lc === target[i]) cls = 'letter-correct'
      else if (lc && lc !== target[i]) cls = 'letter-wrong'
      return (
        <span key={i} className="guess-letter">
          <span className={cls}>{lc || '_'}</span>
        </span>
      )
    })

    return (
      <div className="guess-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="guess-input"
          value={guess}
          onChange={handleHardChange}
          onKeyDown={handleHardKeyDown}
          placeholder="Skriv navnet her…"
          maxLength={50}
          autoComplete="off"
        />
        <div className="guess-letters">{displayLetters}</div>
      </div>
    )
  }

  const renderGame = () => {
    const celeb = questions[currentQ]
    const imgUrl = celeb.img

    return (
      <>
        <div className="quiz-header">
          <p className="question-number">
            Spørsmål {currentQ + 1} av {TOTAL_QUESTIONS}
          </p>
          <button
            className="quit-btn"
            onClick={() => setScreen('home')}
          >
            Avbryt
          </button>
        </div>

        <div className="celebrity-scene">
          <div className={`celebrity-frame ${answered ? 'lifted' : ''}`}>
            <img
              src={imgUrl}
              className="celebrity-img"
              alt="Kjendis"
              loading="eager"
            />
          </div>
        </div>

        {isCorrect === true && (
          <div className="feedback-banner correct visible">
            Riktig! 🎉
          </div>
        )}
        {isCorrect === false && (
          <div className="feedback-banner wrong visible">
            Feil! Det var {celeb.name}.
          </div>
        )}

        {difficulty === 'easy' && renderEasyOptions()}
        {difficulty === 'medium' && renderMediumList()}
        {difficulty === 'hard' && renderHardInput()}

        {answered && (
          <button className="next-btn" onClick={nextQuestion}>
            {currentQ + 1 >= TOTAL_QUESTIONS ? 'Se resultat' : 'Neste'}
          </button>
        )}
      </>
    )
  }

  const renderResults = () => {
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100)
    let verdict = 'Ikke dumt!'
    if (pct === 100) verdict = 'Perfekt!'
    else if (pct >= 70) verdict = 'Bra jobbet!'
    else if (pct >= 40) verdict = 'Ikke dumt!'
    else verdict = 'Trenger øvelse!'

    return (
      <div className="score-card">
        <h1>Resultat</h1>
        <p style={{ fontSize: 18, color: 'var(--text)', margin: '16px 0' }}>
          Vanskadsgrad: {difficulty === 'easy' ? 'Lett' : difficulty === 'medium' ? 'Middels' : 'Vanskelig'}
        </p>
        <div className="score-value">{score} / {TOTAL_QUESTIONS}</div>
        <p className="score-label">{pct}% riktig — {verdict}</p>
        <button
          className="next-btn"
          style={{ marginTop: 24 }}
          onClick={() => setScreen('home')}
        >
          Spill igjen
        </button>
      </div>
    )
  }

  return (
    <div className="quiz-backdrop">
      <div className="quiz-container">
        {screen === 'home' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <h1>Kjendis-quiz</h1>
              <p style={{ color: 'var(--text)', margin: '8px 0 0' }}>
                Kan du gjennkjenne disse kjendisene?
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {DIFFICULTIES.map((d) => (
                <div
                  key={d.id}
                  className="difficulty-card"
                  onClick={() => startGame(d.id)}
                >
                  <div className="mode-pill" style={{ color: d.color, borderColor: d.color }}>
                    {d.label}
                  </div>
                  <h2 className="difficulty-title">{d.label}</h2>
                  <p className="difficulty-desc">{d.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {screen === 'playing' && renderGame()}
        {screen === 'results' && renderResults()}
      </div>
    </div>
  )
}

export default CelebrityQuiz
