import React, {FC, useEffect, useState} from "react";
import {Recipe} from "../utils/recipeTypes";
import {Grid, Typography} from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import IconButton from '@mui/material/IconButton';


type RecipeDisplayProps = {
  recipe: Recipe
}

const SingleRecipeDisplay:FC<RecipeDisplayProps> = ({recipe}) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    Notification.requestPermission();

    if (!('webkitSpeechRecognition' in window)) {
      console.log('Browser does not support speech recognition.');
      return;
    }

    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      handleCommand(finalTranscript.toLowerCase());
    };

    setRecognition(recognition);
  }, []);

  const handleCommand = (command: string) => {
    if (command.includes('next')) {
      handleNext();
    } else if (command.includes('back')) {
      handlePrevious();
    } else if (command.includes('again')) {
      readCurrentStep();
    } else if (command.includes('set timer')) {
      const time = extractTime(command);
      if (time) {
        setTimer(time);
      } else {
        console.log('Invalid time format');
      }
    }
  };

  const readCurrentStep = () => {
    speakText(recipe.steps[currentStep].text);
  }

  const handleNext = () => {
    setCurrentStep((prevIndex) => {
      const newIndex = Math.min(prevIndex + 1, recipe.steps.length - 1);
      speakText(recipe.steps[newIndex].text);
      return newIndex;
    });
  };

  const handlePrevious = () => {
    setCurrentStep((prevIndex) => {
      const newIndex = Math.max(prevIndex - 1, 0);
      speakText(recipe.steps[newIndex].text);
      return newIndex;
    });
  };

  const startListening = () => {
    if (recognition) {
      setListening(true)
      // @ts-ignore
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      setListening(false)
      // @ts-ignore
      recognition.stop();
    }
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const extractTime = (command:string) => {
    const match = command.match(/\b\d+\b/);
    if (match) {
      return parseInt(match[0], 10) * 60000; // Convert minutes to milliseconds
    }
    return null;
  };

  const setTimer = (duration: number) => {
    console.log(`Timer set for ${duration / 60000} minutes`);
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification("Timer expired!", { body: `Your timer for ${duration / 60000} minutes has expired!` });
      }
    }, duration);
  };



  return (
    <Grid container sx={{display: 'flex', padding: 10}}>
      <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
        <img src={recipe.img} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant={'h2'}>
          {recipe.title}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant={'h4'}>
          Koraki
          {!listening ?
            <IconButton aria-label="play" sx={{color: '#d17a22'}} onClick={() => {startListening(); readCurrentStep();}}>
              <PlayCircleIcon />
            </IconButton>
          :
            <IconButton aria-label="pause" sx={{color: '#d17a22'}} onClick={() => {stopListening()}}>
              <StopCircleIcon />
            </IconButton>
          }
        </Typography>
        {recipe.steps.map((step) => {
          return (
            <Grid container key={recipe.title + step.step} style={{fontSize: '18px', display: 'flex', flexDirection: 'row', marginBottom: '8px'}}>
              <Grid item style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{
                  marginRight: '8px',
                  backgroundColor: '#d17a22',
                  padding: '5px 10px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  width: 'fit-content'
                }}>
                  {step.step}.
                </div>
                <div>
                  {step.text}
                </div>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  )
}

export default SingleRecipeDisplay