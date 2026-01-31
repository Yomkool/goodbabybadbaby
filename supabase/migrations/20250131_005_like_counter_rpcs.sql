-- Migration: Like Counter RPC Functions
-- Ticket 013: Like Functionality - Increment/decrement total_likes_received on users and pets

-- Increment user's total_likes_received
CREATE OR REPLACE FUNCTION increment_user_likes(user_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET total_likes_received = total_likes_received + 1
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement user's total_likes_received
CREATE OR REPLACE FUNCTION decrement_user_likes(user_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET total_likes_received = GREATEST(0, total_likes_received - 1)
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment pet's total_likes_received
CREATE OR REPLACE FUNCTION increment_pet_likes(pet_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE pets
  SET total_likes_received = total_likes_received + 1
  WHERE id = pet_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement pet's total_likes_received
CREATE OR REPLACE FUNCTION decrement_pet_likes(pet_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE pets
  SET total_likes_received = GREATEST(0, total_likes_received - 1)
  WHERE id = pet_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION increment_user_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_user_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_pet_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_pet_likes(UUID) TO authenticated;
