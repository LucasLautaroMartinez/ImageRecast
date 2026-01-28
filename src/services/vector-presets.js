const presetList = [
  {
    id: "logo-clean",
    label: "Logo",
    options: {
      numberofcolors: 4,
      colorquantcycles: 3,
      ltres: 1,
      qtres: 1,
      pathomit: 8,
      blurradius: 0,
      linefilter: true,
      scale: 1
    }
  },
  {
    id: "icon-flat",
    label: "Icono",
    options: {
      numberofcolors: 6,
      colorquantcycles: 3,
      ltres: 1,
      qtres: 1,
      pathomit: 6,
      blurradius: 0,
      linefilter: true,
      scale: 1
    }
  },
  {
    id: "illustration",
    label: "Ilustración",
    options: {
      numberofcolors: 16,
      colorquantcycles: 4,
      ltres: 0.8,
      qtres: 0.8,
      pathomit: 4,
      blurradius: 0,
      linefilter: false,
      scale: 1
    }
  },
  {
    id: "sketch",
    label: "Boceto",
    options: {
      numberofcolors: 8,
      colorquantcycles: 3,
      ltres: 0.6,
      qtres: 0.6,
      pathomit: 3,
      blurradius: 1,
      linefilter: false,
      scale: 1
    }
  },
  {
    id: "high-detail",
    label: "Detalle+",
    options: {
      numberofcolors: 32,
      colorquantcycles: 5,
      ltres: 0.4,
      qtres: 0.4,
      pathomit: 2,
      blurradius: 0,
      linefilter: false,
      scale: 1
    }
  },
  {
    id: "black-white",
    label: "B/N",
    options: {
      numberofcolors: 2,
      colorquantcycles: 2,
      ltres: 1,
      qtres: 1,
      pathomit: 6,
      blurradius: 0,
      linefilter: true,
      scale: 1
    }
  },
  {
    id: "pixel-art",
    label: "Pixel",
    options: {
      numberofcolors: 6,
      colorquantcycles: 2,
      ltres: 1.2,
      qtres: 1.2,
      pathomit: 8,
      blurradius: 0,
      linefilter: true,
      scale: 1
    }
  }
];

export const presetMap = Object.fromEntries(
  presetList.map(s => [s.id, s.options])
);