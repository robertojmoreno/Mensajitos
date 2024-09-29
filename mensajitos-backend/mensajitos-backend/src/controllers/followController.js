const User = require('../models/User');
const { sendNotification } = require('./notificationController');

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'Ya estás siguiendo a este usuario' });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    await sendNotification(
      userToFollow._id,
      'new_follower',
      `${currentUser.name} ha comenzado a seguirte`,
      currentUser._id
    );

    res.json({ message: 'Usuario seguido exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ message: 'No estás siguiendo a este usuario' });
    }

    currentUser.following = currentUser.following.filter(id => !id.equals(userToUnfollow._id));
    userToUnfollow.followers = userToUnfollow.followers.filter(id => !id.equals(currentUser._id));

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: 'Usuario dejado de seguir exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
