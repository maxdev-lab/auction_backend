const bidModel = require("../models/bidModel");
const itemModel = require("../models/itemModel");

// 입찰하기 (버튼 누르면 자동 증액)
exports.placeBid = async (req, res) => {
  try {
    const { id } = req.params; // item_id
    console.log(`요청한 유저 id: ${id}`);
    const userId = req.user.user_id;
    console.log(`요청한 유저 id: ${userId}`);

    // 물품 정보 확인
    const item = await itemModel.findById(id, userId);
    console.log(`물품 정보: ${item}`);
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

    //현재 입찰 횟수 조회
    const bidCount = await bidModel.getBidCount(id);

    let nextBidPrice = 0;
    let increment = 0;

    if (bidCount === 0) {
      nextBidPrice = item.start_price;
      increment = 0;
    } else {
      // 5%씩 증가하게끔
      increment = Math.floor(item.start_price * 0.05);
      if (increment < 100) increment = 100;

      nextBidPrice = item.current_price + increment;
    }

    // DB 저장
    await bidModel.createBid(userId, id, nextBidPrice);

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
