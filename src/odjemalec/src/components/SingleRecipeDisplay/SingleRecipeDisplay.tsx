import React, {FC, useEffect, useState} from "react";
import {Recipe, RecipeIngredient, RecipeTime, RecipeType, RecipeTypeLink} from "../../utils/recipeTypes";
import {Avatar, Box, Grid, List, Typography} from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import IconButton from '@mui/material/IconButton';
import KitchenRoundedIcon from '@mui/icons-material/KitchenRounded';
import {useResponsive} from "../../hooks/responsive";


type RecipeDisplayProps = {
  recipe: Recipe
}

const SingleRecipeDisplay:FC<RecipeDisplayProps> = ({recipe}) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [currentStep, setCurrentStep] = useState<number>(0)
  const responsive = useResponsive('up', 'lg')
  const [openMenu, setOpenMenu] = useState<boolean>(false)

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

  useEffect(() => {
    console.log('currentStep updated:', currentStep);
    if(listening)
      speakText(recipe.steps[currentStep].text); // Ensure current step is read when updated
  }, [currentStep]);

  const handleCommand = (command: string) => {
    if (command.includes('next') || command.includes('continue')) {
      handleNext();
    } else if (command.includes('back') || command.includes('previous')) {
      handlePrevious();
    } else if (command.includes('again') || command.includes('repeat')) {
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
    setCurrentStep((prevStep) => {
      const stepindex = parseInt(JSON.parse(JSON.stringify(prevStep)));
      speakText(recipe.steps[stepindex].text);
      return prevStep;
    });
  }

  const handleNext = () => {
    setCurrentStep((prevStep) => {
      const newIndex = Math.min(prevStep + 1, recipe.steps.length - 1);
      return newIndex;
    });
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => {
      const newIndex = Math.max(prevStep - 1, 0);
      return newIndex;
    });
  };

  const startListening = () => {
    if (recognition) {
      setListening(true)
      // @ts-ignore
      recognition.start();
      speakText(recipe.steps[currentStep].text)
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
        new Notification("Timer expired!", {
          body: `Your timer for ${duration / 60000} minutes has expired!`,
          icon: '/icon-144.png'
        });
      }
    }, duration);
  };

  return (
    <Grid container sx={{display: 'flex', padding: responsive ? 10 : 2}}>
      <Grid item xs={12} sx={{
        backgroundColor: '#1F1D2B',
        display: 'flex',
        flexDirection: responsive ? 'row' : 'column',
        padding: responsive ? 12 : 0,
        borderRadius: '16px',
        columnGap: responsive ? 8 : 0,
        marginTop: responsive ? 0 : 6
      }}>
        <Grid item xs={12} sm={12} md={12} lg={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#15131D',
            borderRadius: '16px',
            height: '100%',
            width: '100%',
            alignItems: 'center'
          }}
        >
          <Box sx={{
            padding: '12px',
            background: 'radial-gradient(circle at 100%, #3f2e20, #563f2d 50%, #2a1e15)',
            top: '-50%',
            borderRadius: '100%',
            border: '2px solid #3f2e20',
            backgroundColor: '#2a1e15',
            transform: 'translate(0%, -25%)'
          }}>
            <img src={recipe.img} style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: '1px solid #3f2e20'
            }} />
          </Box>
          <Box sx={{fontWeight: 700, fontSize: '18px', padding: 1, paddingTop: 0, position: 'relative', letterSpacing: '1px'}}>
            <div style={{backgroundColor: '#d17a22', borderRadius: '8px', width: 'fit-content', padding: '4px 8px', color: 'white'}}>
              {recipe.category}
            </div>
          </Box>
          <Typography sx={{fontSize: '24px', padding: 1, marginBottom: 1, textAlign: 'center', color: '#fff'}}>
            {recipe.title}
          </Typography>
          <Grid item xs={12} sx={{
            color: '#fff',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: 3

          }}>
            <Typography sx={{fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, fontSize: '18px'}}>
              Prep times:
            </Typography>
            <List sx={{ listStyleType: 'disc', width: '100%' }}>
              {recipe.times.map((ingredientTime: RecipeTime) => {
                return (
                  <Grid key={ingredientTime._id} item xs={12} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2}}>
                    <Grid item xs={12} lg={9} sx={{display: 'flex', flexDirection: 'row', columnGap: 2}}>
                      <KitchenRoundedIcon sx={{color: '#fff'}} />

                      <Typography>
                        {ingredientTime.label || ''}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} lg={3}>
                      <Typography sx={{textAlign: 'right'}}>
                        {ingredientTime.time ? ingredientTime.time : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                )
              })}
            </List>
          </Grid>
          <Grid item xs={12} sx={{
            color: '#fff',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: 3

          }}>
            <Typography sx={{fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, fontSize: '18px'}}>
              Ingredients:
            </Typography>
            <List sx={{ listStyleType: 'disc', width: '100%' }}>
              {recipe.ingredients.map((ingredientItem: RecipeIngredient) => {
                return (
                  <Grid key={ingredientItem._id} item xs={12} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 2}}>
                    <Grid item xs={12} lg={9} sx={{display: 'flex', flexDirection: 'row', columnGap: 2}}>
                      <KitchenRoundedIcon sx={{color: '#fff'}} />

                      <Typography>
                        {ingredientItem.description || ''}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} lg={3}>
                      <Typography sx={{textAlign: 'right'}}>
                        {ingredientItem.quantity ? ingredientItem.quantity + ' ' + ingredientItem.unit : ''}
                      </Typography>
                    </Grid>
                  </Grid>
                )
              })}
            </List>
          </Grid>
        </Grid>


        <Grid item xs={12} lg={8} sx={{
          padding: 3,
          borderRadius: '16px',
        }}>
          <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 2, gap: 2}}>
            <Typography variant={'h4'}>
              Step by step process
            </Typography>
            {!listening ?
              <IconButton aria-label="play" sx={{color: '#d17a22'}} onClick={startListening}>
                <PlayCircleIcon sx={{fontSize: '35px'}} />
              </IconButton>
              :
              <IconButton aria-label="pause" sx={{color: '#d17a22'}} onClick={stopListening}>
                <StopCircleIcon sx={{fontSize: '35px'}} />
              </IconButton>
            }
          </Grid>

          {recipe.steps.map((step) => {
            return (
              <Grid key={recipe.title + step.step} style={{
                fontSize: '18px',
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 30,
                columnGap: 10,
                border: (listening && (step.step - 1) === currentStep) ? '2px solid #d17a22': '2px solid #1F1D2B',
                borderRadius: '16px',
                padding: 10,
                filter: (listening && (step.step - 1) === currentStep) ? 'drop-shadow(0px 8px 24px rgba(234, 124, 105, 0.32))' : ''
              }}>
                <Grid>
                  <div style={{
                    marginRight: '8px',
                    backgroundColor: '#d17a22',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    width: 'fit-content',
                    fontWeight: 700,
                  }}>
                    {step.step}
                  </div>
                </Grid>
                <Grid style={{display: 'flex', flexDirection: 'row'}}>
                  <div style={{lineHeight: '2rem'}}>
                    {step.text}
                  </div>
                </Grid>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default SingleRecipeDisplay