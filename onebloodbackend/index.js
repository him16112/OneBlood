const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const app = express();
const User = require("./database/userModel");
const nodemailer = require("nodemailer");

require("dotenv").config(); // This loads the environment variables from .env file



// Use environment variables for secret key and API key
const secretKey = process.env.SECRET_KEY;
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 8080;

// Use environment variables for email and app password
const companyEmail = process.env.COMPANY_EMAIL;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;



app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "POST, GET, OPTIONS",
    allowedHeaders: ["Content-Type"],
    credentials: true, // Allow credentials
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

function calculateDistance(coord1, coord2) {
  const lon1 = coord1.lng;
  const lat1 = coord1.lat;
  const lon2 = coord2.lng;
  const lat2 = coord2.lat;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance * 1000; // Convert distance to meters
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

async function getCoordinatesFromAddress(apiKey, address) {
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check for API errors
    if (data.status === "OK") {
      // Extract location information
      const location = data.results[0].geometry.location;
      console.log(location.lat, location.lng);

      return { lat: location.lat, lng: location.lng };
    } else {
      throw new Error("Geocoding API Error: " + data.status);
    }
  } catch (error) {
    throw new Error("Error fetching data: " + error);
  }
}

// Define an endpoint to get available donors with the same blood group
app.get("/availableDonors", verifyToken, async (req, res) => {
  const userBloodGroup = req.cookies.bloodGroup;
  const userId = req.user.id;
  const userAddress = req.cookies.address;
  console.log(userAddress);
  const currentTime = new Date();

  try {
    // Use the User model to query available donors with matching blood group and availability
    const donorsWithMatchingBloodGroup = await User.find({
      bloodGroup: userBloodGroup,
      availability: {
        $exists: true,
        $not: { $size: 0 },
        // Filter availability entries that haven't exceeded the current time
        // $elemMatch: {
        //   date: { $gte: currentTime },
        // },
      },
      _id: { $ne: userId },
    });

    // Get the coordinates of the user's address
    const userCoordinates = await getCoordinatesFromAddress(
      apiKey,
      userAddress
    );

    for (const donor of donorsWithMatchingBloodGroup) {
      const address = donor.address;

      // Get coordinates for the donor's address
      const donorCoordinates = await getCoordinatesFromAddress(apiKey, address);

      // Calculate distance for the donor
      const distance = calculateDistance(userCoordinates, donorCoordinates);

      // Add distance property to donor object
      donor.distance = distance;
    }

    donorsWithMatchingBloodGroup.sort((a, b) => a.distance - b.distance);

    console.log(donorsWithMatchingBloodGroup);

    res.json(donorsWithMatchingBloodGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all users who have posted a request matching the user's blood group
app.get("/usersRequests", verifyToken, async (req, res) => {
  const userBloodGroup = req.cookies.bloodGroup;
  const userId = req.user.id; // Assuming you have a way to get the current user's ID.
  const userAddress = req.cookies.address;
  const currentTime = new Date(); // Get the current date and time

  try {
    // Use the User model to query users who have posted matching requests, excluding the requests of the current user.
    const usersWithMatchingRequests = await User.find({
      bloodGroup: userBloodGroup,
      requests: {
        $exists: true,
        $not: { $size: 0 },
        // Filter requests that haven't exceeded the current time
        // $elemMatch: {
        //   date: { $gte: currentTime },
        // },
      },
      _id: { $ne: userId }, // Exclude requests by the current user
    });

    // Get the coordinates of the user's address
    const userCoordinates = await getCoordinatesFromAddress(
      apiKey,
      userAddress
    );

    for (const donor of usersWithMatchingRequests) {
      const address = donor.address;

      // Get coordinates for the donor's address
      const donorCoordinates = await getCoordinatesFromAddress(apiKey, address);

      // Calculate distance for the donor
      const distance = calculateDistance(userCoordinates, donorCoordinates);

      // Add distance property to donor object
      donor.distance = distance;
    }

    usersWithMatchingRequests.sort((a, b) => a.distance - b.distance);

    console.log(usersWithMatchingRequests);

    res.json(usersWithMatchingRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Create a new POST route for scheduling availability
app.post("/scheduleAvailability", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  const userEmail = user.email;
  try {
    // Get the user data from the token (you can access it as req.user)
    const { date } = req.body;

    // Create a new schedule document and save it to the database using the User model
    const schedule = {
      date,
    };

    // Save the schedule to the user's document (assuming you have a User schema with an availability array)
    const user = await User.findById(req.user.id);
    user.availability.push(schedule);
    await user.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: companyEmail, // Use the COMPANY_EMAIL from the .env file
        pass: gmailAppPassword,
      },
    });

    let mailOptions = {
      from: {
        name: "One Blood",
        address: "shauntait341@gmail.com",
      },
      to: userEmail,
      subject: "Urgent: Blood Donation Request",
      text: `Dear Donor,

      Your availability for blood donation has been successfully scheduled for ${new Date(
        date
      ).toLocaleDateString()}.
      
      Thank you for your willingness to help others in need. Your contribution can save lives!
      
      Regards,  
      One Blood Team`,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending email: ", emailError);
      return res.status(500).json({
        message:
          "Availability scheduled, but failed to send email notification.",
      });
    }

    res.json({
      message:
        "Availability scheduled  and email notification send successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST A REQUEST
app.post("/postRequest", verifyToken, async (req, res) => {
  const userBloodGroup = req.cookies.bloodGroup;
  const userId = req.user.id;

  try {
    const { date } = req.body;

    // Create a new schedule document and save it to the database using the User model
    const schedule = { date };

    // Save the schedule to the user's document
    const user = await User.findById(req.user.id);
    user.requests.push(schedule);
    await user.save();

    const usersWithMatchingRequests = await User.find({
      bloodGroup: userBloodGroup,
      _id: { $ne: userId }, // Exclude requests by the current user
    });

    const usersEmail = usersWithMatchingRequests.map((user) => user.email);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: companyEmail,
        pass: gmailAppPassword,
      },
    });

    let mailOptions = {
      from: { name: "One Blood", address: "shauntait341@gmail.com" },
      to: usersEmail,
      subject: "Urgent: Blood Donation Request",
      text: `Dear Donor,
      
      A blood donation request for group ${userBloodGroup} has been posted on ${new Date(
        date
      ).toLocaleDateString()}.
      
      Please help if you can. 
      
      Regards, One Blood Team`,
    };

    try {
      await transporter.sendMail(mailOptions);

      // Send confirmation email to the user who posted the request
      let confirmationMailOptions = {
        from: { name: "One Blood", address: user.email },
        to: user.email, // Sending confirmation to the request creator
        subject: "Your Blood Donation Request Has Been Posted Successfully",
        text: `Dear ${user.name},
        
        Your blood donation request for group ${userBloodGroup} has been successfully posted on ${new Date(
          date
        ).toLocaleDateString()}.

        You will be notified when a donor is available. Thank you for using One Blood.
        
        Regards, One Blood Team`,
      };

      await transporter.sendMail(confirmationMailOptions);

      return res.status(200).json({
        message:
          "Request created successfully, and email notifications sent to matching donors.",
      });
    } catch (emailError) {
      console.error("Error sending email: ", emailError.message);
      return res.status(500).json({
        message:
          "Request created successfully, but failed to send email notifications. Please try again later.",
      });
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get all users route
app.get("/getUsers", async (req, res) => {
  try {
    // Use the User model to query all users from the database
    const users = await User.find();

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// REGISTER ROUTE
app.post("/register", async (req, res) => {
  const { username, password, email, phoneNo, address, bloodGroup } = req.body;

  // Check if the username is already in use
  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(400).json({ message: "Username already in use" });
  } else {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user to the database
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        phoneNo,
        address,
        bloodGroup,
      });

      await newUser.save();

      res.json({ message: "Registration successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Use bcrypt.compare to securely compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Use the user's ID to query the user's blood group
    const userBloodGroup = user.bloodGroup;
    const userAddress = user.address;

    const token = jwt.sign(
      { id: user._id, username: user.username },
      secretKey,
      { expiresIn: "900s" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 900000,
   });

    res.cookie("username", user.username, {
      httpOnly: false, // This cookie will be accessible via JavaScript
      secure: process.env.NODE_ENV === "production",
      maxAge: 900000,
    });

    res.cookie("bloodGroup", userBloodGroup, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 900000,
    });

    res.cookie("address", userAddress, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 900000,
    });

    res.json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Logout Route

app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the HttpOnly cookie
  res.status(200).json({ message: "Logout successful" });
});

// Protected route
app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Protected resource accessed successfully" });
});

// Verify JWT middleware

function verifyToken(req, res, next) {
  const token = req.cookies.token; // Read token from HttpOnly cookie

  if (!token) {
    res.status(401).json({ message: "No token provided" });
  } else {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Token is invalid" });
      } else {
        req.user = user;
        next();
      }
    });
  }
}





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
