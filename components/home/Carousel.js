import Slider from "react-slick";

export default function Carousel({ items, clothingType }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="carousel">
      <h2>{clothingType}</h2>
      <Slider {...settings}>
        {items.map((item, index) => (
          <div key={index}>
            <img src={item.src} style={{ transform: `translate(${item.x}px, ${item.y}px) scale(${item.scale})` }} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
