import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Animalcard.css';


const AnimalCard = ({ animal, onDelete }) => {

  const onDeleteClick = (id) => {
    axios.delete(`http://localhost:3000/api/animals/${id}`)
      .then(() => {
        console.log("Animal deleted successfully");
        onDelete(id);
      })
      .catch((err) => {
        console.log("Delete error", err);
      });
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="https://img.freepik.com/free-photo/cows-standing-green-field-front-fuji-mountain-japan_335224-197.jpg?uid=R190339105&ga=GA1.1.569604014.1741108132&semt=ais_hybrid"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {animal?.animalid || "Unknown"}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {animal?.breed || "unknown"}
            <br />
            {animal?.dob || "unknown"}
            <br />
            {animal?.weight || "unknown"}
            <br />
            {animal?.gender || "unknown"}
            <br />
            {animal?.health || "unknown"}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>

        <Button  color="primary" onClick={() => onDeleteClick(animal._id)}
        style={{ backgroundColor: '#ff6347' }}>
          Delete
        </Button>

        <Link className = "btn btn-outline-warning float-right" to={`/showdetails/${animal._id}`} >Details</Link>

        
      </CardActions>
      
    </Card> 
  );
};

export default AnimalCard;
