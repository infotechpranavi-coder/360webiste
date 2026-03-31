import dbConnect from '../../lib/mongodb';
import Settings from '../../models/Settings';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        let settings = await Settings.findOne();
        if (!settings) {
          settings = await Settings.create({ 
            popularSection: true, 
            upcomingSection: true,
            destinationsSection: true,
            exploreSection: true,
            testimonialsSection: true,
            facebookUrl: "",
            facebookEnabled: true,
            instagramUrl: "",
            instagramEnabled: true,
            twitterUrl: "",
            twitterEnabled: true,
            linkedinUrl: "",
            linkedinEnabled: true,
            youtubeUrl: "",
            youtubeEnabled: true,
            whatsappUrl: "",
            whatsappEnabled: true
          });
        } else {
          // If settings exist but new fields (links) are missing, we need to ensure defaults.
          // This handles existing records from before the social link update.
          let changed = false;
          const defaults = {
            facebookUrl: "",
            facebookEnabled: true,
            instagramUrl: "",
            instagramEnabled: true,
            twitterUrl: "",
            twitterEnabled: true,
            linkedinUrl: "",
            linkedinEnabled: true,
            youtubeUrl: "",
            youtubeEnabled: true,
            whatsappUrl: "",
            whatsappEnabled: true
          };

          for (const key in defaults) {
            // Check if key is missing OR is an empty string
            if (settings[key] === undefined || settings[key] === "") {
              settings[key] = defaults[key];
              changed = true;
            }
          }
          
          if (changed) {
            await settings.save();
          }
        }
        res.status(200).json({ success: true, data: settings });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        let settings = await Settings.findOne();
        if (!settings) {
          settings = await Settings.create(req.body);
        } else {
          settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
            new: true,
            runValidators: true,
          });
        }
        res.status(200).json({ success: true, data: settings });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
