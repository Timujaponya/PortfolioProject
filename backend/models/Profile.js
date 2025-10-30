// Profil bilgileri modeli

const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,
    avatarUrl: String,
    cvUrl: String,
    socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        website: String,
        // Icon override için
        githubIcon: String,
        linkedinIcon: String,
        twitterIcon: String,
        websiteIcon: String
    },
    techStack: [{
        name: String,
        icon: String
    }],
    updatedAt: { type: Date, default: Date.now }
});

profileSchema.pre("findOneAndUpdate", function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
