# Happy Girlfriend's Day

A premium-feeling, single-page romantic carousel website built with HTML, CSS, and vanilla JavaScript. The experience uses a horizontal snap-scrolling layout, elegant gradients, subtle glass effects, and a handwritten letter ending for a handcrafted feel.

## Project overview

This project is designed to feel intimate and polished rather than like a generic Valentine’s template. It includes:

- a six-slide narrative experience
- smooth wheel, keyboard, and swipe navigation
- a relationship duration counter
- a floating music button and ambient audio
- a final handwritten-style letter animation
- responsive styling for mobile and desktop

## Folder structure

- index.html — page structure and slide content
- css/style.css — all visual styling, layout, colors, and responsive behavior
- js/script.js — carousel logic, counter logic, music toggle, and letter animation
- assets/images/ — SVG illustrations used for the floral slides
- assets/music/ — the background audio file for the music control

## How to replace every image

The current floral artwork is stored as SVG files in the assets/images folder.

1. Open the folder [assets/images](assets/images).
2. Replace the existing SVG file with your own image file using the same file name.
3. If you want to use a different file name, update the image source in [index.html](index.html).

## How to replace flowers

If you want a different bouquet or decorative flower art, replace the SVG in [assets/images/bouquet.svg](assets/images/bouquet.svg).

You can also create a second decorative illustration and swap it in by editing the image tag inside [index.html](index.html).

## How to add or replace music

The site currently uses a local audio file in [assets/music/soft-romance.wav](assets/music/soft-romance.wav).

1. Place your own audio file in [assets/music](assets/music).
2. Rename it to soft-romance.wav or update the source in [index.html](index.html).
3. The floating music button will continue to work as long as the audio file is linked correctly.

## How to edit the relationship start date

The relationship counter is calculated from a date in [js/script.js](js/script.js).

Change this line:

```js
const relationshipStart = new Date('2021-08-14T00:00:00');
```

Replace the date with the one that matters to you.

## How to edit memories

You can update the memory slide content in [index.html](index.html) by editing the timeline item text inside the memories section.

## How to edit future memories

The future memories checklist is also in [index.html](index.html). Update the list items in the future slide to match your own hopes and plans.

## How to edit the handwritten letter

The letter text is stored in [js/script.js](js/script.js) as the letterText variable.

Change the string value to write your own heartfelt message.

## How to change fonts

You can change the fonts from the Google Fonts link in [index.html](index.html) and the font variables in [css/style.css](css/style.css).

The main font variables are:

- --heading-font
- --body-font
- --script-font

## How to change colors

The main colors, gradients, and accents are defined in the root section of [css/style.css](css/style.css).

Edit the values of these variables to build a different mood:

- --bg-primary
- --bg-secondary
- --accent
- --secondary-accent
- --text
- --muted

## How to deploy using GitHub Pages

1. Create a GitHub repository.
2. Upload these files to the repository root.
3. Open the repository in GitHub.
4. Go to Settings → Pages.
5. Choose the main branch and the root folder.
6. Save and wait for the site to publish.

## How to customize everything without coding experience

You do not need to write code to personalize the site:

- Replace the text directly in [index.html](index.html).
- Replace the images in [assets/images](assets/images).
- Replace the audio file in [assets/music](assets/music).
- Update the date in [js/script.js](js/script.js).
- Change the colors in [css/style.css](css/style.css).

If you want a more personal version, you can simply edit the visible content in [index.html](index.html), the letter text in [js/script.js](js/script.js), and the colors in [css/style.css](css/style.css).
