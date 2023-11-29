import { AccessCode } from "../model/accessCodeModel.js";

export const createAccessCode = async (req, res) => {
  const { accessCode } = req.body;
  try {
    let availableAccessCode = await AccessCode.findOne();

    if (availableAccessCode) {
      availableAccessCode.accessCode = accessCode;
      await availableAccessCode.save();
    } else {
      availableAccessCode = new AccessCode(req.body);
      await availableAccessCode.save();
    }

    res.status(200).json({ accessCode: availableAccessCode });
  } catch (err) {
    return res.status(500).json({ messsage: { error: err.messsage } });
  }
};

export const getAccessCode = async (req, res) => {
  try {
    let accessCode = await AccessCode.findOne();

    res.status(200).json(accessCode);
  } catch (err) {
    return res.status(500).json({ messsage: { error: err.messsage } });
  }
};
