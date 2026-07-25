# AURELIA Clinical Intelligence 3.0 — Digital Eye Twin

Версия с упрощённой главной страницей, анимированной фронтальной моделью глаза и учебным клиническим сценарием при подозрении на отторжение роговичного трансплантата.

## Важно
Все данные пациента синтетические. Раздел лечения — демонстрационный сценарий поддержки принятия решений, а не медицинское назначение. Он основан на опубликованных обзорах и материалах AAO/EyeWiki; конкретную терапию определяет офтальмолог после очного осмотра и исключения инфекции.

## Запуск
```bash
cd frontend
npm install
npm run dev
```

Для Vercel используйте `frontend` как Root Directory.


## Версия 3.0
- увеличена визуальная иерархия главного экрана;
- добавлены крупные клинические метрики;
- полностью переработана анатомическая анимированная модель глаза;
- добавлены лимб, склера, сосуды, глубина радужки, крипты, зрачковый край, роговичный купол, граница трансплантата, швы, сектор активности, микросаккады и моргание;
- план лечения преобразован в крупный пошаговый клинический маршрут с предупреждениями и доказательной оговоркой.


## AURELIA 4.0

- Переработана модель глаза: нейтральная фотографическая палитра, естественные веки, склера, сосуды, радужка, слёзная плёнка, роговичный блик и ненавязчивая визуализация границы трансплантата.
- В разделе пациента добавлены три полноценные учебные клинические формы: клиническое заключение, протокол сквозной кератопластики и информированное согласие.
- Каждая форма открывается во встроенном просмотрщике, скачивается как автономный HTML и печатается в PDF средствами браузера.
- Источники содержания: AAO, NHS, Moorfields Eye Hospital и рецензируемые обзоры по профилактике и лечению отторжения трансплантата роговицы.
- Формы явно маркированы как учебные и не воспроизводят официальный бланк конкретной клиники.

## AURELIA 5.0 — этап 1

- Полностью переработан процедурный рендер переднего сегмента глаза.
- Добавлены более естественные ткани век, зернистость кожи, асимметричное освещение и анатомичная глазная щель.
- Радужка теперь строится из 880 неодинаковых волокон, крипт и концентрических борозд.
- Улучшены склера, сосуды конъюнктивы, лимб, роговичный купол, слёзная плёнка и оптические блики.
- Сохранены слежение за курсором, микросаккады, реакция зрачка и моргание.


## AURELIA 5.0 Step 2 — Clinical Documents & Report Center

- Full-screen document workspace with document registry and patient context.
- Three richly formatted educational clinical documents.
- A4 print styles and browser Print-to-PDF workflow.
- Standalone HTML export.
- Version history, signature status and local control identifiers.
- Source verification panel linking to AAO, EyeWiki, NHS and Moorfields.
- Explicit educational disclaimers; no claim of official hospital forms or legally significant signatures.


## AURELIA 6.0.1 — Scientific Eye Model, iteration 1

- Rebuilt the anterior-segment Canvas renderer from the uploaded baseline.
- Removed decorative labels, risk text and advertising-style overlays from the anatomy.
- Added restrained clinical illumination, limbal depth, irregular iris stroma, corneal optics, PKP graft-host junction, interrupted sutures and diffuse stromal oedema.
- Reduced cursor tracking and animation amplitude; blinking and microsaccades remain subtle.
