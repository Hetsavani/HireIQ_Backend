const Submission = require("../models/Submission");
const User = require("../models/User");

exports.createSubmission = async (req, res) => {
  try {
    const {
      userId,
      quizId,
      responses,
      score,
      totalQuestions,
      percentage,
      startedAt,
      submittedAt,
      eligibility,
    } = req.body;
    console.log("======================================================");
    console.log(req.body);
    const newSubmission = new Submission({
      userId,
      quizId,
      responses,
      score,
      totalQuestions,
      percentage,
      startedAt,
      submittedAt,
      eligibility,
    });

    const saved = await newSubmission.save();
    res
      .status(201)
      .json({ message: "Submission saved successfully", data: saved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSubmissionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const submissions = await Submission.find({ userId })
      .populate("quizId")
      .sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

exports.getLeaderboardByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    console.log("Fetching leaderboard for quiz:", quizId);
    // Get all submissions for the quiz, sort by score descending
    // const submissions = await Submission.find({ quizId: String(quizId) })
    //   .sort({ score: -1 })

    //================================================================
    // const submissions = await Submission.find({ quizId: String(quizId) })
    //   .sort({ score: -1 })
    //   .populate({
    //     path: 'userId',
    //     select: 'name email'
    //   })
    //   .lean();

    // console.log(submissions);
    //================================================================
    // console.log("Received quizId:", quizId); // should be ObjectId string
    // const submissions = await Submission.find({ quizId })
    //   .sort({ score: -1 })
    //   .populate({
    //     path: 'userId',
    //     select: 'name email'
    //   })
    //   .lean(); // Makes it plain JS objects (optional but helpful)

    const leaderboard = await Submission.aggregate([
      {
        $match: { quizId: quizId },
      },
      {
        $addFields: {
          userObjectId: { $toObjectId: "$userId" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { score: -1 },
      },
    ]);

    console.log("======================================================");

    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
    console.log(leaderboard);

    const ans = await Promise.all(
      leaderboard.map(async (submission) => {
        try {
          console.log(submission.userId);
          const user = await User.findById(submission.userId).select(
            "name email"
          );
          console.log(user);
          return {
            responses:submission.responses,
            score:submission.score,
            totalQuestions:submission.totalQuestions,
            percentage:submission.percentage,
            startedAt:submission.startedAt,
            submittedAt:submission.submittedAt,
            eligibility:submission.eligibility,
            name: user?.name || "Unknown",
            email: user?.email || "Unknown",
          };
        } catch (error) {
          return {
            ...submission,
            name: "Unknown",
            email: "Unknown",
          };
        }
      })
    );
    // Add rank manually after sorting

    res.status(200).json(ans);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
