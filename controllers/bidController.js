const bidModel = require("../models/bidModel");
const itemModel = require("../models/itemModel");

// 입찰하기 (버튼 누르면 자동 증액)
exports.placeBid = async (req, res) => {
  try {
    const { id } = req.params; 
    const userId = req.user.user_id;

    // 물품 정보 확인
    const item = await itemModel.findById(id, userId);
    if (!item) {
      return res.status(404).json({ message: "물품이 존재하지 않습니다." });
    }

    // 유효성 검사 (본인 입찰 금지, 종료 확인)
    if (item.user_id === userId) {
      return res
        .status(400)
        .json({ message: "자신의 물건에는 입찰할 수 없습니다." });
    }
    if (new Date(item.end_time) < new Date()) {
      return res.status(400).json({ message: "이미 종료된 경매입니다." });
    }

    let nextBidPrice = Math.floor(item.current_price * 1.05);
    
    let increment = nextBidPrice - item.current_price;

    if (increment < 100) {
      increment = 100;
      nextBidPrice = item.current_price + 100;
    }

    // DB 저장
    await bidModel.createBid(userId, id, nextBidPrice);
    await itemModel.updateCurrentPrice(id, nextBidPrice);

    res.status(201).json({
      message: "입찰 성공!",
      data: {
        increment,
        currentPrice: nextBidPrice,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 입찰 내역 조회
exports.getBids = async (req, res) => {
  try {
    const { id } = req.params;
    const bids = await bidModel.getBidsByItemId(id);
    res.json(bids);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
