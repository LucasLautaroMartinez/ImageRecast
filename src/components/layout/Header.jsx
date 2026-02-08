import Menu from './Menu.jsx'
import SubrayadoSVG from '../../assets/subrayado.svg'
import InfoPanel from '../ui/InfoPanel.jsx'
import '../../styles/header.css';

export default function Header({title = '', info = null}) {

  return (
    <header>

      <Menu />
      <div className='menu-separator-header'></div>

        <div className='title-container'>
          {title && (
            <h5 className='title'>
              {title}
              <img src={SubrayadoSVG} alt="" aria-hidden="true" className='marker-underline' />
            </h5>
          )}
          <div className='info-button-panel'>
            {info && (
              <InfoPanel content={info}/>
            )}
          </div>
        </div>

      <div className="header-separator">
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 L1200,0 L1200,100 Q600,200 0,100 Z"/>
        </svg>
      </div>

    </header>
  );
}