const bidModel = require('../models/bidModel');
const itemModel = require('../models/itemModel'); 

// 입찰하기 (버튼 누르면 자동 증액)
exports.placeBid = async (req, res) => {
  try {
    const { id } = req.params; // item_id
    const userId = req.user.user_id; // 로그인한 사람

    // 1. 물품 정보 가져오기 (가격을 알아야 하니까)
    const item = await itemModel.findById(id);
    if (!item) {
      return res.status(404).json({ message: '물품이 존재하지 않습니다.' });
    }

    // 2. 유효성 검사
    // - 본인 물건 입찰 금지
    if (item.user_id === userId) {
      return res.status(400).json({ message: '자신의 물건에는 입찰할 수 없습니다.' });
    }
    // - 경매 종료 여부 확인
    if (new Date(item.end_time) < new Date()) {
      return res.status(400).json({ message: '이미 종료된 경매입니다.' });
    }

    // ★ 3. 가격 계산 로직 (핵심!)
    // 증가액 = 시작가(start_price)의 5%
    // 소수점 나오면 안되니까 Math.floor로 내림 처리
    const increment = Math.floor(item.start_price * 0.05);
    
    // 만약 증가액이 0원이면(시작가 10원 등) 최소 100원은 오르게 설정 (선택사항)
    const finalIncrement = increment < 100 ? 100 : increment; 

    // 새로운 가격 = 현재가 + 증가액
    const nextBidPrice = item.current_price + finalIncrement;

    // 4. DB에 저장 요청
    await bidModel.createBid(userId, id, nextBidPrice);

    res.status(201).json({ 
      message: '입찰 성공!', 
      data: { 
        increment: finalIncrement,  // 얼마 올랐는지
        currentPrice: nextBidPrice  // 현재 얼마인지
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
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
    res.status(500).json({ message: '서버 오류' });
  }
};