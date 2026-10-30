---
title: "El Proceso en los Diferentes Tipos de Animación"
description: "Plantilla académica para 1.3.3: El Proceso en los Diferentes Tipos de Animación"
---

## Introducción

Detrás de una escena animada de apenas diez segundos donde un personaje 3D camina, recoge un objeto y sonríe, existe una cadena de ingeniería gráfica altamente especializada conocida como **pipeline de producción de animación**. Igual que una línea de ensamblaje automotriz donde cada estación construye y valida un subsistema antes de pasarlo a la siguiente, el proceso de animación transforma un boceto conceptual en una malla geométrica articulada, iluminada y renderizada mediante algoritmos matemáticos precisos (Marschner & Shirley, 2016; de Vega, 2017).

## Preproducción Visual (Guion, Storyboard, Animatic) y Construcción de Activos (Modelado y Texturizado)

El proceso inicia en la fase de **Preproducción Visual**, donde el guion escrito se traduce en un **Storyboard** (secuencia de viñetas que especifican el encuadre, la acción y los movimientos de cámara) y posteriormente en un **Animatic o *Leica Reel***, que monta los cuadros del *storyboard* en una línea de tiempo de video sincronizada con la pista de audio temporal (*scratch track*) para validar el ritmo exacto (*timing*) de cada escena antes de producir un solo cuadro definitivo (de Vega, 2017; Ruiz, 2018).

En la animación 3D, la construcción de activos (*Asset Creation*) comprende tres etapas geométricas y ópticas (Marschner & Shirley, 2016):

* **Modelado 3D y Topología:** Creación de la superficie del objeto en el espacio (*X*, *Y*, *Z*) mediante mallas de polígonos (preferentemente cuadriláteros o *quads* que fluyen siguiendo los músculos para deformarse limpiamente al animar), superficies paramétricas *NURBS* o escultura digital de alta densidad seguida de *retopología*.  
* **Mapeo UV (*UV Unwrapping*):** Proyección bidimensional (*u*, *v*) de la malla 3D —similar a desplegar un cubo de cartón sobre una mesa plana— para poder pintar texturas 2D sobre su superficie sin distorsión.  
* **Texturizado y Materiales PBR (*Physically Based Rendering*):** Asignación de mapas de bits que definen el comportamiento óptico de la superficie ante la luz: mapa de color base (*Albedo*), rugosidad microscópica (*Roughness*), carácter metálico (*Metallic*) y mapa de normales (*Normal Map*, que simula relieves detallados alterando el vector normal por píxel sin añadir polígonos).

## Esqueletización (Rigging, Skinning, FK/IK), Interpolación por Curvas y Renderizado

Para dotar de movimiento a la malla estática se ejecutan las fases de articulación y cálculo cinemático (Marschner & Shirley, 2016, Cap. 15 y 16):

* **Rigging y Skinning (Pesado de Vértices):** El *Rigging* construye un esqueleto jerárquico de huesos (*bones/joints*) emparentados (donde mover el hombro arrastra al codo, y el codo arrastra a la muñeca), además de expresiones faciales mediante deformaciones de malla (*Blend Shapes / Morph Targets*). El *Skinning* (como el algoritmo *Linear Blend Skinning*) asigna pesos de influencia *w*<sub>*i*</sub> ∈ [0, 1] a cada vértice de la malla respecto a los huesos cercanos.  
* **Cinemática Directa (FK) vs. Cinemática Inversa (IK):** En **Cinemática Directa (*Forward Kinematics*)**, el animador rota manualmente cada hueso padre hacia los hijos (θ<sub>1</sub> → θ<sub>2</sub> → θ<sub>3</sub>) para calcular la posición final de la mano; es ideal para el balanceo libre de brazos al caminar. En **Cinemática Inversa (*Inverse Kinematics* - IK)**, el animador coloca directamente la posición objetivo del extremo final (*end-effector*, por ejemplo, el pie firme sobre un escalón o la mano agarrando una palanca) y el algoritmo (como el método heurístico iterativo **FABRIK** —*Forward And Backward Reaching Inverse Kinematics*— o el Jacobiano inverso) resuelve automáticamente los ángulos θ<sub>1</sub>, θ<sub>2</sub> de la cadera y la rodilla.  
* **Interpolación Matemática (*Splines* y Cuaterniones), Iluminación y Renderizado:** Los fotogramas clave se interpolan en el editor de curvas (*Graph Editor*) mediante polinomios cúbicos de **Hermite, Catmull-Rom o Bézier** *P*(*t*) = (1 − *t*)<sup>3</sup>*P*<sub>0</sub> + 3(1 − *t*)<sup>2</sup>*tP*<sub>1</sub> + 3(1 − *t*)*t*<sup>2</sup>*P*<sub>2</sub> + *t*<sup>3</sup>*P*<sub>3</sub> para las traslaciones, y mediante **interpolación lineal esférica de cuaterniones unitarios (*SLERP*)** para las rotaciones 3D, evitando el bloqueo de cardán (*Gimbal Lock*). Finalmente, el motor de **Renderizado** (por rasterización en tiempo real o por trazado de rayos *Path Tracing*) calcula la iluminación global y entrega los cuadros para la **Composición Final**.

## Conclusiones

> El éxito técnico de cualquier producción animada reside en la disciplina de su pipeline: una buena topología en el modelado facilita el *skinning*, un *rig* bien construido con controles `FK/IK` acelera la animación, y el uso de curvas de Bézier y cuaterniones (`SLERP`) garantiza movimientos fluidos y físicamente creíbles.

## Fuentes Documentales

* de Vega, A. (2017). *Animación de elementos*. Alfaomega.  
* Marschner, S., & Shirley, P. (2016). *Fundamentals of Computer Graphics* (4th ed., Cap. 15: Curves y Cap. 16: Computer Animation). CRC Press.  
* Ruiz, D. (2018). *Manual de Producción Multimedia: De la idea al remake*. Ediciones Promonet.  
* Williams, R. (2019). *Técnicas de animación. Dibujos animados, animación 3D y videojuegos*. Anaya Multimedia.
