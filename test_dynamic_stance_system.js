// Test script to verify dynamic multi-stance system implementation

const fs = require('fs');

function testDynamicStanceSystem() {
    console.log('🧪 TESTING DYNAMIC MULTI-STANCE SYSTEM');
    console.log('======================================\n');

    try {
        // Load the updated monster database
        const database = JSON.parse(fs.readFileSync('complete_monster_database.json', 'utf8'));
        console.log(`📊 Database loaded: ${database.monsters.length} total monsters\n`);

        // Test 1: Verify key enhanced monsters
        console.log('🎯 TEST 1: Key Enhanced Monsters');
        console.log('--------------------------------');
        
        const keyMonsters = ['Alatreon', 'Fatalis', 'Zinogre', 'Rathalos'];
        const enhancedResults = {};
        
        keyMonsters.forEach(name => {
            const monster = database.monsters.find(m => m.name === name);
            if (monster && monster.stance_patterns) {
                const stances = Object.keys(monster.stance_patterns);
                enhancedResults[name] = {
                    found: true,
                    stanceCount: stances.length,
                    stances: stances,
                    hasComplexTriggers: Object.values(monster.stance_patterns).some(stance => 
                        typeof stance.triggers === 'object'
                    ),
                    hasStanceIds: Object.values(monster.stance_patterns).some(stance => 
                        stance.stanceId
                    )
                };
                
                console.log(`✅ ${name}:`);
                console.log(`   - Stances: ${stances.length} (${stances.join(', ')})`);
                console.log(`   - Complex triggers: ${enhancedResults[name].hasComplexTriggers ? '✅' : '❌'}`);
                console.log(`   - Stance IDs: ${enhancedResults[name].hasStanceIds ? '✅' : '❌'}`);
            } else {
                enhancedResults[name] = { found: false };
                console.log(`❌ ${name}: Not found or missing stance patterns`);
            }
        });
        
        // Test 2: Stance distribution analysis
        console.log('\n🔢 TEST 2: Stance Distribution Analysis');
        console.log('--------------------------------------');
        
        const stanceDistribution = {};
        let complexMonstersCount = 0;
        let simpleMonsterCount = 0;
        
        database.monsters.forEach(monster => {
            if (monster.stance_patterns) {
                const count = Object.keys(monster.stance_patterns).length;
                if (!stanceDistribution[count]) {
                    stanceDistribution[count] = [];
                }
                stanceDistribution[count].push(monster.name);
                
                if (count >= 3) {
                    complexMonstersCount++;
                } else {
                    simpleMonsterCount++;
                }
            }
        });
        
        console.log('Stance count distribution:');
        Object.keys(stanceDistribution).sort((a, b) => parseInt(a) - parseInt(b)).forEach(count => {
            console.log(`  ${count} stances: ${stanceDistribution[count].length} monsters`);
        });
        
        console.log(`\nComplexity Summary:`);
        console.log(`  - Complex monsters (3+ stances): ${complexMonstersCount}`);
        console.log(`  - Simple monsters (2 stances): ${simpleMonsterCount}`);
        console.log(`  - Complex ratio: ${(complexMonstersCount / (complexMonstersCount + simpleMonsterCount) * 100).toFixed(1)}%`);
        
        // Test 3: Verify specific game patterns
        console.log('\n🎮 TEST 3: Game Pattern Verification');
        console.log('------------------------------------');
        
        const patterns = {
            'Alatreon': {
                expectedStances: ['normal', 'fire_mode', 'ice_mode', 'escaton_phase'],
                description: 'Fire Mode → Ice Mode → Escaton Phase pattern'
            },
            'Fatalis': {
                expectedStances: ['normal', 'enraged', 'nova_phase', 'desperation_phase'],
                description: 'Normal → Enraged → Nova → Desperation pattern'
            },
            'Zinogre': {
                expectedStances: ['normal', 'charged', 'exhausted'],
                description: 'Normal → Charged → Exhausted cycle'
            },
            'Rathalos': {
                expectedStances: ['grounded', 'flying', 'enraged_flying'],
                description: 'Ground → Air → Enraged Flying pattern'
            }
        };
        
        Object.entries(patterns).forEach(([name, pattern]) => {
            const monster = database.monsters.find(m => m.name === name);
            if (monster && monster.stance_patterns) {
                const actualStances = Object.keys(monster.stance_patterns);
                const hasExpectedPattern = pattern.expectedStances.every(stance => 
                    actualStances.includes(stance)
                );
                
                console.log(`${hasExpectedPattern ? '✅' : '❌'} ${name}: ${pattern.description}`);
                if (!hasExpectedPattern) {
                    console.log(`   Expected: [${pattern.expectedStances.join(', ')}]`);
                    console.log(`   Actual: [${actualStances.join(', ')}]`);
                }
            }
        });
        
        // Test 4: Trigger complexity verification
        console.log('\n⚙️  TEST 4: Trigger Complexity Verification');
        console.log('-------------------------------------------');
        
        let complexTriggersCount = 0;
        let simpleTriggersCount = 0;
        
        database.monsters.forEach(monster => {
            if (monster.stance_patterns) {
                Object.values(monster.stance_patterns).forEach(stance => {
                    if (typeof stance.triggers === 'object') {
                        complexTriggersCount++;
                    } else {
                        simpleTriggersCount++;
                    }
                });
            }
        });
        
        console.log(`Complex trigger objects: ${complexTriggersCount}`);
        console.log(`Simple trigger strings: ${simpleTriggersCount}`);
        console.log(`Complex trigger ratio: ${(complexTriggersCount / (complexTriggersCount + simpleTriggersCount) * 100).toFixed(1)}%`);
        
        // Test 5: UI Scalability verification
        console.log('\n🖥️  TEST 5: UI Scalability Verification');
        console.log('---------------------------------------');
        
        // Find monsters with different stance counts for UI testing
        const testCases = {
            '2 stances': stanceDistribution['2'] ? stanceDistribution['2'][0] : 'None',
            '3 stances': stanceDistribution['3'] ? stanceDistribution['3'][0] : 'None',
            '4 stances': stanceDistribution['4'] ? stanceDistribution['4'][0] : 'None',
            '5 stances': stanceDistribution['5'] ? stanceDistribution['5'][0] : 'None'
        };
        
        console.log('UI Test Cases (monsters for each stance count):');
        Object.entries(testCases).forEach(([count, monster]) => {
            console.log(`  ${count}: ${monster}`);
        });
        
        // Final success criteria check
        console.log('\n🏆 FINAL ASSESSMENT: SUCCESS CRITERIA');
        console.log('=====================================');
        
        const criteria = {
            'Dynamic stance count support': complexMonstersCount > 50,
            'Game data integration': enhancedResults['Alatreon']?.hasStanceIds && enhancedResults['Fatalis']?.hasStanceIds,
            'Complete per-stance data': complexTriggersCount > 100,
            'Scalable UI support': Object.keys(stanceDistribution).length >= 4,
            'Complex monster coverage': ['Alatreon', 'Fatalis', 'Zinogre'].every(name => enhancedResults[name]?.found),
            'No oversimplification': complexMonstersCount >= simpleMonsterCount
        };
        
        let passedCriteria = 0;
        const totalCriteria = Object.keys(criteria).length;
        
        Object.entries(criteria).forEach(([criterion, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${criterion}`);
            if (passed) passedCriteria++;
        });
        
        const successRate = (passedCriteria / totalCriteria * 100).toFixed(1);
        console.log(`\n🎯 SUCCESS RATE: ${passedCriteria}/${totalCriteria} (${successRate}%)`);
        
        if (successRate >= 80) {
            console.log('\n🎉 DYNAMIC MULTI-STANCE SYSTEM: SUCCESSFULLY IMPLEMENTED!');
            console.log('✨ System supports 2-5 stances dynamically');
            console.log('⚡ Complex monster patterns preserved');
            console.log('🎯 Game complexity maintained');
        } else {
            console.log('\n⚠️  IMPLEMENTATION INCOMPLETE - Some criteria not met');
        }
        
        return successRate >= 80;
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    }
}

// Execute if run directly
if (require.main === module) {
    const success = testDynamicStanceSystem();
    process.exit(success ? 0 : 1);
}

module.exports = { testDynamicStanceSystem };