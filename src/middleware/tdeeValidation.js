import prisma from "../../prisma/prismaClient.js";

export const validateTdeeCalculation = async (req, res, next) => {
  try {
    const { profileId } = req.body;
    
    if (!profileId) {
      return res.status(400).json({ 
        message: "Profile ID is required",
        error: "NO_PROFILE_ID"
      });
    }

    // Cek apakah user sudah memiliki TDEE calculation
    const tdeeCalculation = await prisma.tdeeCalculation.findFirst({
      where: { 
        profileId: Number(profileId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!tdeeCalculation) {
      return res.status(403).json({ 
        message: "You must calculate and save your TDEE first before accessing meal plans",
        error: "NO_TDEE_CALCULATION"
      });
    }

    // Tambahkan tdeeId ke request untuk digunakan di controller
    req.tdeeId = tdeeCalculation.tdeeId;
    next();
  } catch (error) {
    res.status(500).json({ 
      message: "Error validating TDEE calculation",
      error: error.message 
    });
  }
}; 