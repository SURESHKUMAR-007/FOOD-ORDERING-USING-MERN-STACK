import React from 'react'
import '../styles/Footer.css'

const Footer = () => {
  return (
    <div className="Footer">
      <h4>@SB Foods - Have a feast with the tasty food everyday....</h4>
      <div className="footer-body">

        <ul>
          <li>Biriyani</li>
          <li>Pizza</li>
        </ul>

        <ul>
          <li>Beverages</li>
          <li>Burger</li>
        </ul>

        <ul>
          <li>Pulav's</li>
          <li>Rice bowls</li>
        </ul>

        <ul>
          <li>Fried Momo's</li>
          <li>Chicken</li>
        </ul>

        <ul>
          <li>Sandwich</li>
          <li>BBQ</li>
        </ul>
      </div>
	  <h3>About Us</h3>
	  <p>Our food ordering website offers a seamless and convenient way to explore and order delicious meals from your favorite restaurants. With a user-friendly interface, quick delivery, and a wide variety of options, we ensure that every meal is just a few clicks away. Whether you're craving comfort food, healthy options, or something new, our service brings quality food straight to your doorstep, anytime, anywhere. Enjoy fast, reliable service with secure payment options, all while discovering new culinary experiences!</p>
	<div><center>
    <h5>OUR PROJECT-Team Members</h5>
    <h6>SURESH KUMAR D - Team Leader</h6>  <h6>SOUNTHARIYAN S</h6>     <h6>STELLA L</h6>  
    <h6>SOUMYA SHIBU</h6></center>
    </div>
	  <div className="footer-bottom">
        <p>@ 2024 Sb-foods.com - All rights reserved</p>
      </div>
    </div>
  )
}

export default Footer