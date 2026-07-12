const socialService = require('../services/social.service');

class SocialController {
  async createCSRActivity(req, res, next) {
    try {
      const result = await socialService.createCSRActivity(req.body);
      res.status(201).json({
        success: true,
        message: 'CSR Activity created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCSRActivities(req, res, next) {
    try {
      const result = await socialService.getAllCSRActivities();
      res.status(200).json({
        success: true,
        message: 'CSR Activities retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getCSRActivityById(req, res, next) {
    try {
      const result = await socialService.getCSRActivityById(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'CSR Activity not found',
          data: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'CSR Activity retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCSRActivity(req, res, next) {
    try {
      const result = await socialService.updateCSRActivity(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'CSR Activity updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCSRActivity(req, res, next) {
    try {
      await socialService.deleteCSRActivity(req.params.id);
      res.status(200).json({
        success: true,
        message: 'CSR Activity deleted successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }

  async joinCSRActivity(req, res, next) {
    try {
      let proof_url = null;
      if (req.file) {
        proof_url = `/uploads/${req.file.filename}`;
      }
      const result = await socialService.joinCSRActivity(req.params.id, { ...req.body, proof_url });
      res.status(201).json({
        success: true,
        message: 'Joined CSR Activity successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async uploadProof(req, res, next) {
    try {
      let proof_url = null;
      if (req.file) {
        proof_url = `/uploads/${req.file.filename}`;
      }
      const result = await socialService.uploadProof(req.params.id, proof_url);
      res.status(200).json({
        success: true,
        message: 'Proof uploaded successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async approveCSRActivity(req, res, next) {
    try {
      const result = await socialService.approveCSRActivity(req.params.id);
      res.status(200).json({
        success: true,
        message: 'CSR Activity approved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectCSRActivity(req, res, next) {
    try {
      const result = await socialService.rejectCSRActivity(req.params.id);
      res.status(200).json({
        success: true,
        message: 'CSR Activity rejected successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async createParticipation(req, res, next) {
    try {
      const result = await socialService.createParticipation(req.body);
      res.status(201).json({
        success: true,
        message: 'Participation created successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllParticipations(req, res, next) {
    try {
      const result = await socialService.getAllParticipations(req.query);
      res.status(200).json({
        success: true,
        message: 'Participations retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getParticipationById(req, res, next) {
    try {
      const result = await socialService.getParticipationById(req.params.id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Participation not found',
          data: null
        });
      }
      res.status(200).json({
        success: true,
        message: 'Participation retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateParticipation(req, res, next) {
    try {
      const result = await socialService.updateParticipation(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Participation updated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteParticipation(req, res, next) {
    try {
      await socialService.deleteParticipation(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Participation deleted successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }

  async approveParticipation(req, res, next) {
    try {
      await socialService.approveParticipation(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Participation approved successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectParticipation(req, res, next) {
    try {
      await socialService.rejectParticipation(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Participation rejected successfully',
        data: null
      });
    } catch (error) {
      next(error);
    }
  }

  async getGenderDistribution(req, res, next) {
    try {
      const result = await socialService.getGenderDistribution();
      res.status(200).json({
        success: true,
        message: 'Gender distribution retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getDepartmentDistribution(req, res, next) {
    try {
      const result = await socialService.getDepartmentDistribution();
      res.status(200).json({
        success: true,
        message: 'Department distribution retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getParticipationTrends(req, res, next) {
    try {
      const result = await socialService.getParticipationTrends();
      res.status(200).json({
        success: true,
        message: 'Participation trends retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SocialController();
