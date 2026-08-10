import { GalleryLightbox } from "@/components/gallery-lightbox";
import { CONTAINER, SectionHeading } from "@/components/sections/shared";

const GALLERY_IMAGES = [
  { src: "/gallery/szukacz-laserowy.jpg", alt: "Szukacz laserowy" },
  { src: "/gallery/szukacz-laserowy-2.jpg", alt: "Szukacz laserowy" },
  { src: "/gallery/szukacz-laserowy-nietypowa-stopka.jpg", alt: "Szukacz laserowy z nietypową stopką" },
  { src: "/gallery/odrosniki-i-maska-bahtinova.jpg", alt: "Odrośniki i maska Bahtinova" },
  { src: "/gallery/dokladka-eq5.jpg", alt: "Dokładka do montażu EQ5" },
  { src: "/gallery/dokladka-eq5-2.jpg", alt: "Dokładka do montażu EQ5" },
  { src: "/gallery/dokladka-dobson.jpg", alt: "Dokładka do teleskopu Dobson" },
  { src: "/gallery/polka-dobson.jpg", alt: "Półka na akcesoria do teleskopu Dobson" },
  { src: "/gallery/polka-na-okulary.jpg", alt: "Półka na okulary" },
  { src: "/gallery/przejsciowka-jeden-na-dwa-szukacze.jpg", alt: "Przejściówka z jednego na dwa szukacze" },
  { src: "/gallery/przejsciowka-1-na-2-szukacze-2.jpg", alt: "Przejściówka z jednego na dwa szukacze" },
  { src: "/gallery/przejsciowka-1-na-2-szukacze-3.jpg", alt: "Przejściówka z jednego na dwa szukacze" },
  { src: "/gallery/przejsciowka-biala-czarna-1-na-2.jpg", alt: "Biało-czarna przejściówka z jednego na dwa szukacze" },
  { src: "/gallery/zatyczka-elastyczna.jpg", alt: "Zatyczka z elastycznego materiału" },
];

export function Gallery() {
  return (
    <section id="galeria" className={`${CONTAINER} py-20`}>
      <SectionHeading
        eyebrow="Galeria"
        title="Projekty w terenie"
        description="Zdjęcia zrealizowanych projektów — wydrukowane i przetestowane w praktyce."
      />

      <GalleryLightbox images={GALLERY_IMAGES} />
    </section>
  );
}
