import React from 'react'
import {Link} from 'react-router-dom'

const Navigation = () => {
  return (
    <div>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <Link class="navbar-brand" to ="/">
    Animal Information & Services</Link>


    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to = "/insert">
            Add Animal</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to ="/AnimalServices">Services</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to ="/services">View Services</Link>
        </li>
      </ul>
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navigation;
