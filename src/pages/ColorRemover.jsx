import { useState, useEffect, useRef } from 'react'
import { Toaster } from 'anni'
import { toast } from 'anni'
import stylesColorRemover from '../styles/colorRemover.module.css'

import BaseButton from '../components/ui/BaseButton.jsx'

export default function Converter() {



  return (
    <main className={stylesColorRemover['main-colorRemover']}>
      <Toaster
        position='bottom-right'
        defaultTimeDuration={2000}
      />

      <BaseButton>asd</BaseButton>


    </main>
  );
}