## cần chú ý việc query DB, query cần ít càng tốt

## chỗ token có thể thêm version trong db để có thể bỏ các token cũ, force login lại

làm phần ranking simple

tạo các modal trong thư mục ranking
rank_ladders
{
\_id,
rankMode: rankMode,
name: 'rank normal',

ruleSet: {
initialPoint: 1000,
winPoint: 20,
losePoint: 15,
},

status: 'active' | 'ended',
}

rank_tier_configs
{
code: string
minPoint: number
}

rank_history
{
\_id,
rankLadderId,

players: [
{
playerId,
oldPoint: 200,
newPoint: 220,
point: 20
result: BattleResultEnum,
},
{
playerId,
oldPoint: 210,
newPoint: 195,
newPoint: 15,
result: BattleResultEnum,
},
],

}

player_rank_profiles
{
\_id,
playerId,
rankLadderId,

point: 1000,

tier: rank_tier_configs,

totalMatch: 45,
win: 25,
lose: 20,
draw: 20,
winStreak: 3,
loseStreak: 0,

highestRating: 1320,
highestTier: rank_tier_configs,

updatedAt,
}
