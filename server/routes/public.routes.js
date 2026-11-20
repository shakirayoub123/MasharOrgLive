const express = require("express");
const router = express.Router();

/* ────────────────────────────────────────────────────────────────
   POST /api/public/partner/request
   Submit a partner info request (like blanchard partner page)
──────────────────────────────────────────────────────────────── */
router.post("/partner/request", async (req, res) => {
    try {
        const PartnerRequest = require("../models/PartnerRequest");
        const { sendMail } = require("../helpers");

        const {
            inquiryType = "partner",
            firstName,
            lastName,
            email,
            phone,
            company,
            jobTitle,
            website,
            linkedin,
            partnershipType,
            roleInterest,
            experience,
            region,
            message
        } = req.body;

        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !region?.trim()) {
            return res.status(400).json({ success: false, message: "Please fill in all required contact fields." });
        }

        const resolvedType = partnershipType || (inquiryType === "join-team" ? (roleInterest || "Team Member") : inquiryType === "mentor" ? (roleInterest || "Executive Mentor") : "Consulting Partner");

        const request = await PartnerRequest.create({
            inquiryType,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            company: company?.trim() || "Independent / Individual",
            jobTitle: jobTitle?.trim() || roleInterest?.trim() || "Applicant",
            website: website?.trim() || "",
            linkedin: linkedin?.trim() || "",
            partnershipType: resolvedType,
            roleInterest: roleInterest?.trim() || "",
            experience: experience?.trim() || "",
            region: region.trim(),
            message: message?.trim() || ""
        });

        // Send confirmation email internally (optional but good practice)
        try {
            await sendMail(
                "elise@mashar.org",
                `New ${inquiryType === "join-team" ? "Team / Coach Application" : "Partner Request"}: ${firstName} ${lastName}`,
                "new_partner_request",
                {
                    full_name: `${firstName} ${lastName}`,
                    inquiryType,
                    email,
                    phone,
                    company: company || "Independent",
                    jobTitle: jobTitle || roleInterest,
                    partnershipType: resolvedType,
                    region,
                    message
                }
            );
        } catch (e) {
            console.error("Failed to send partner request email:", e);
        }

        return res.status(201).json({
            success: true,
            message: inquiryType === "join-team"
                ? "Your application to join our team has been successfully submitted."
                : "Your partner request has been successfully submitted."
        });
    } catch (err) {
        console.error("Partner request error:", err);
        res.status(500).json({ success: false, message: "Failed to submit request. Please try again." });
    }
});

module.exports = router;
