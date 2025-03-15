import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Container, Card, Button, ListGroup, Navbar, Nav, Form } from "react-bootstrap"; // Import Navbar and Nav here
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null); // State to store the user's details
  const [loading, setLoading] = useState(true); // Loading state to show a loading indicator
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // For navigation

  // Fetch the logged-in user's details
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        // Decode the token to get the user's _id
        const decoded = jwtDecode(token);
        const userId = decoded._id;

        // Fetch the user's details from the backend
        const userRes = await axios.get(`http://localhost:5000/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data); // Store the user's details in state
        setLoading(false); // Set loading to false when data is fetched
        if (userRes.data.profilePicture) {
          setPreviewImage(userRes.data.profilePicture);
        }
      } catch (error) {
        console.log("Error fetching user details", error);
        setLoading(false); // Set loading to false in case of an error
      }
    }
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user details when the component mounts
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // Remove the token from localStorage
    navigate("/login"); // Redirect to the login page
  };

  const handleHomeRedirect = () => {
    navigate("/chat"); // Redirect to the DisplayPosts page
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("You must be logged in to upload a profile picture");
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      
      reader.onloadend = async () => {
        const base64Image = reader.result;
        
        // Send the base64 image to the server
        const response = await axios.post(
          "http://localhost:5000/user/profile-picture",
          { profilePicture: base64Image },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        // Update the user state with the new profile picture
        setUser({ ...user, profilePicture: base64Image });
        setUploading(false);
        alert("Profile picture uploaded successfully!");
      };
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setUploading(false);
      alert("Failed to upload profile picture");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  if (!user) {
    return <div>User not found</div>; // Show an error message if no user data is found
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand onClick={handleHomeRedirect} style={{ cursor: 'pointer' }}>
            Home
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Card className="shadow">
          <Card.Body>
            <Card.Title className="text-center mb-4">Profile</Card.Title>
            
            {/* Profile Picture Section */}
            <div className="text-center mb-4">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile" 
                  style={{ 
                    width: "150px", 
                    height: "150px", 
                    borderRadius: "50%", 
                    objectFit: "cover",
                    border: "3px solid #dee2e6" 
                  }} 
                />
              ) : (
                <div 
                  style={{ 
                    width: "150px", 
                    height: "150px", 
                    borderRadius: "50%", 
                    backgroundColor: "#dee2e6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    fontSize: "3rem",
                    color: "#6c757d" 
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <Form.Group controlId="formFile" className="mt-3">
                <Form.Label>Change Profile Picture</Form.Label>
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="w-75 mx-auto" 
                />
              </Form.Group>
              
              <Button 
                variant="primary" 
                onClick={handleImageUpload} 
                disabled={!imageFile || uploading}
                className="mt-2"
              >
                {uploading ? "Uploading..." : "Upload Picture"}
              </Button>
            </div>
            
            <ListGroup>
              <ListGroup.Item>
                <strong>Name:</strong> {user.name}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Email:</strong> {user.email}
              </ListGroup.Item>
            </ListGroup>
            
            <div className="d-grid mt-4">
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Profile;