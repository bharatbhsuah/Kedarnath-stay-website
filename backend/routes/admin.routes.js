const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const adminController = require('../controllers/admin.controller');

router.use(verifyToken, requireAdmin);

function handleUpload(maxCount) {
  return (req, res, next) => {
    upload.array('images', maxCount)(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: `Maximum ${maxCount} images per upload.` });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Each image must be 5MB or less.' });
        }
        return res.status(400).json({ message: err.message || 'Upload error' });
      }
      next();
    });
  };
}

router.get('/dashboard', adminController.getDashboard);

router.get('/rooms', adminController.listRooms);
router.post('/rooms', adminController.createRoom);
router.put('/rooms/:id', adminController.updateRoom);
router.delete('/rooms/:id', adminController.deleteRoom);
router.post('/rooms/:id/images', handleUpload(4), adminController.uploadRoomImages);
router.delete('/rooms/:id/images/:imageId', adminController.deleteRoomImage);
router.put('/rooms/:id/images/:imageId/primary', adminController.setPrimaryRoomImage);

router.get('/tents', adminController.listTents);
router.post('/tents', adminController.createTent);
router.put('/tents/:id', adminController.updateTent);
router.delete('/tents/:id', adminController.deleteTent);
router.post('/tents/:id/images', handleUpload(4), adminController.uploadTentImages);
router.delete('/tents/:id/images/:imageId', adminController.deleteTentImage);
router.put('/tents/:id/images/:imageId/primary', adminController.setPrimaryTentImage);

router.get('/bookings', adminController.listAdminBookings);
router.put('/bookings/:id/status', adminController.updateBookingStatus);

router.get('/price-settings', adminController.listPriceSettings);
router.post('/price-settings', adminController.createPriceSetting);
router.put('/price-settings/:id', adminController.updatePriceSetting);
router.delete('/price-settings/:id', adminController.deletePriceSetting);

router.get('/enquiries', adminController.listEnquiries);
router.put('/enquiries/:id/status', adminController.updateEnquiryStatus);
router.delete('/enquiries/:id', adminController.deleteEnquiry);

module.exports = router;

