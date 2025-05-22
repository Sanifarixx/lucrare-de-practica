import React from 'react';
import Card from "./Card";

const PlanningToAdoptAPet = () => {
  return (
    
    <div className='planning-container'>
        <h1>Plănuiești să adopți un animal?</h1>
        <div className='boxes-container'>
            <Card 
              title="Bucuria adopției unui animal" 
              description="Aduce un animal în viața ta poate fi o experiență extrem de împlinitoare, nu doar pentru tine, ci și pentru prietenul blănos pe care îl primești în casă. Există un farmec aparte în a adopta orice companion."/>
            <Card 
              title="Ghid pentru adopția unui animal" 
              description="Te gândești să adaugi un nou membru în familia ta? Adopția unui animal este o opțiune minunată de luat în considerare. Drumul spre găsirea companionului ideal implică gândire atentă, cercetare și planificare, dar recompensele sunt neprețuite."/>
            <Card 
              title="Puterea vindecătoare a animalelor" 
              description="Animalele au o capacitate extraordinară de a ne atinge viețile profund, oferind nu doar companie, ci și o legătură terapeutică care poate avea un impact pozitiv asupra stării noastre fizice, mentale și emoționale."/>
        </div>
    </div>
  )
}

export default PlanningToAdoptAPet;
