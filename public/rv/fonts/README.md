# Atlas SDF de la sala de identidad

`sala-sdf.json` y `sala-sdf.png` se generaron con `msdf-bmfont-xml` a partir de
**Noto Sans Medium** (SIL Open Font License 1.1, ver `OFL.txt`).

Incluye ASCII y Latin-1 Supplement para que los textos 3D de A-Frame muestren
correctamente los acentos y signos del español (`Á`, `É`, `Í`, `Ó`, `Ú`, `Ñ`,
`¡`, `¿`, etc.). El nombre termina en `-sdf` para que A-Frame use el shader SDF.

Comando de generación:

```bash
npx msdf-bmfont-xml -f json -o sala-sdf -s 42 -m 1024,1024 -t sdf --pot \
  -i charset.txt /usr/share/fonts/noto/NotoSans-Medium.ttf
```

El archivo de caracteres contiene los códigos 32-126 y 160-255.
