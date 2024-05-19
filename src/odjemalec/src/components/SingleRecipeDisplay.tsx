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

      if (finalTranscript.includes('next')) {
        handleNext();
      } else if (finalTranscript.includes('back')) {
        handlePrevious();
      } else if (finalTranscript.includes('again')) {
        readCurrentStep()
      }
    };

    setRecognition(recognition);
  }, []);

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
            <Grid container style={{fontSize: '18px', display: 'flex', flexDirection: 'row', marginBottom: '8px'}}>
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