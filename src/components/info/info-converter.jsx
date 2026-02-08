import ConverterImg from '../../assets/info-images/converter.png'

export default function InfoConverter() {
  return (
    <>
      <h2>Convertidor de imágenes</h2>
      <p>
        Esta herramienta permite convertir formatos de imagen.
      </p>
      {/* <p>
        Ajusta el contraste y la resolución para mejores resultados.
      </p> */}
      <img src={ConverterImg} alt="Vista previa ASCII" />
    </>
  );
}