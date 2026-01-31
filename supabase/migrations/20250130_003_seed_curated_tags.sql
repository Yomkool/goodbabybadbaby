-- Seed curated_tags table with initial tags
-- Categories: behavior, activity, mood, appearance, location, species-specific

INSERT INTO curated_tags (tag, category) VALUES
  -- Good Baby Behaviors
  ('being helpful', 'behavior'),
  ('good listener', 'behavior'),
  ('best friend', 'behavior'),
  ('loyal companion', 'behavior'),
  ('gentle giant', 'behavior'),
  ('well behaved', 'behavior'),
  ('obedient', 'behavior'),
  ('protective', 'behavior'),
  ('cuddly', 'behavior'),
  ('polite', 'behavior'),

  -- Bad Baby Behaviors
  ('chaos gremlin', 'behavior'),
  ('trouble maker', 'behavior'),
  ('shoe destroyer', 'behavior'),
  ('furniture attacker', 'behavior'),
  ('counter surfer', 'behavior'),
  ('escape artist', 'behavior'),
  ('food thief', 'behavior'),
  ('attention seeker', 'behavior'),
  ('zoomies', 'behavior'),
  ('dramatic', 'behavior'),
  ('sass master', 'behavior'),
  ('judging you', 'behavior'),
  ('ignoring commands', 'behavior'),
  ('selective hearing', 'behavior'),

  -- Activities
  ('nap time', 'activity'),
  ('playtime', 'activity'),
  ('walk time', 'activity'),
  ('treat time', 'activity'),
  ('bath time', 'activity'),
  ('training', 'activity'),
  ('fetch', 'activity'),
  ('swimming', 'activity'),
  ('hiking', 'activity'),
  ('road trip', 'activity'),
  ('vet visit', 'activity'),
  ('grooming', 'activity'),
  ('sunbathing', 'activity'),
  ('bird watching', 'activity'),
  ('squirrel chasing', 'activity'),

  -- Moods
  ('happy', 'mood'),
  ('sleepy', 'mood'),
  ('excited', 'mood'),
  ('confused', 'mood'),
  ('hungry', 'mood'),
  ('grumpy', 'mood'),
  ('curious', 'mood'),
  ('proud', 'mood'),
  ('guilty', 'mood'),
  ('innocent face', 'mood'),
  ('side eye', 'mood'),
  ('puppy eyes', 'mood'),
  ('blep', 'mood'),
  ('derp', 'mood'),
  ('majestic', 'mood'),

  -- Appearance
  ('floofy', 'appearance'),
  ('chonky', 'appearance'),
  ('smol', 'appearance'),
  ('long boi', 'appearance'),
  ('big ears', 'appearance'),
  ('toe beans', 'appearance'),
  ('boopable snoot', 'appearance'),
  ('fluffy tail', 'appearance'),
  ('whiskers', 'appearance'),

  -- Locations
  ('couch potato', 'location'),
  ('bed hog', 'location'),
  ('window watcher', 'location'),
  ('backyard', 'location'),
  ('park adventures', 'location'),
  ('beach day', 'location'),
  ('car ride', 'location'),
  ('hiding spot', 'location'),

  -- Species-specific - Dogs
  ('good boy', 'dogs'),
  ('good girl', 'dogs'),
  ('pupper', 'dogs'),
  ('doggo', 'dogs'),
  ('woofer', 'dogs'),
  ('bork', 'dogs'),
  ('sploot', 'dogs'),

  -- Species-specific - Cats
  ('kitty', 'cats'),
  ('void', 'cats'),
  ('loaf', 'cats'),
  ('making biscuits', 'cats'),
  ('if i fits i sits', 'cats'),
  ('midnight zoomies', 'cats'),
  ('knocking things over', 'cats'),
  ('3am concert', 'cats'),

  -- Species-specific - Other
  ('binky', 'rabbits'),
  ('wheel time', 'small pets'),
  ('chirpy', 'birds'),
  ('tank life', 'fish'),
  ('basking', 'reptiles'),

  -- Seasonal/Events
  ('birthday', 'events'),
  ('gotcha day', 'events'),
  ('halloween costume', 'events'),
  ('holiday spirit', 'events'),
  ('new sibling', 'events'),
  ('first day home', 'events')
ON CONFLICT (tag) DO NOTHING;
