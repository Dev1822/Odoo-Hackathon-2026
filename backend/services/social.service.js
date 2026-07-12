const socialRepository = require('../repositories/social.repository');

class SocialService {
  async createCSRActivity(data) {
    return await socialRepository.createCSRActivity(data);
  }

  async getAllCSRActivities() {
    return await socialRepository.getAllCSRActivities();
  }

  async getCSRActivityById(id) {
    return await socialRepository.getCSRActivityById(id);
  }

  async updateCSRActivity(id, data) {
    return await socialRepository.updateCSRActivity(id, data);
  }

  async deleteCSRActivity(id) {
    return await socialRepository.deleteCSRActivity(id);
  }

  async joinCSRActivity(csr_activity_id, data) {
    return await socialRepository.createParticipation({ csr_activity_id, ...data });
  }

  async uploadProof(id, proof_url) {
    return await socialRepository.updateProof(id, proof_url);
  }

  async approveCSRActivity(id) {
    return await socialRepository.updateCSRActivity(id, { status: 'approved' });
  }

  async rejectCSRActivity(id) {
    return await socialRepository.updateCSRActivity(id, { status: 'rejected' });
  }

  async createParticipation(data) {
    return await socialRepository.createParticipation(data);
  }

  async getAllParticipations(filters) {
    return await socialRepository.getAllParticipations(filters);
  }

  async getParticipationById(id) {
    return await socialRepository.getParticipationById(id);
  }

  async updateParticipation(id, data) {
    return await socialRepository.updateParticipation(id, data);
  }

  async deleteParticipation(id) {
    return await socialRepository.deleteParticipation(id);
  }

  async approveParticipation(id) {
    return await socialRepository.approveParticipation(id);
  }

  async rejectParticipation(id) {
    return await socialRepository.rejectParticipation(id);
  }

  async getGenderDistribution() {
    return await socialRepository.getGenderDistribution();
  }

  async getDepartmentDistribution() {
    return await socialRepository.getDepartmentDistribution();
  }

  async getParticipationTrends() {
    return await socialRepository.getParticipationTrends();
  }
}

module.exports = new SocialService();
