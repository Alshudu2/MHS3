// Script to merge enhanced dynamic monsters into the main database

const fs = require('fs');
const path = require('path');

function mergeEnhancedMonsters() {
    try {
        // Read the current monster database
        const currentDb = JSON.parse(fs.readFileSync('complete_monster_database.json', 'utf8'));
        
        // Read the enhanced monsters
        const enhancedData = JSON.parse(fs.readFileSync('enhanced_dynamic_monsters.json', 'utf8'));
        
        console.log(`Current database has ${currentDb.monsters.length} monsters`);
        console.log(`Enhanced data has ${enhancedData.enhanced_monsters.length} monsters to update`);
        
        // Create a map of enhanced monsters by name for quick lookup
        const enhancedMap = {};
        enhancedData.enhanced_monsters.forEach(monster => {
            enhancedMap[monster.name] = monster;
        });
        
        let updatedCount = 0;
        
        // Update existing monsters with enhanced data
        currentDb.monsters = currentDb.monsters.map(monster => {
            if (enhancedMap[monster.name]) {
                console.log(`Updating ${monster.name} with enhanced ${Object.keys(enhancedMap[monster.name].stance_patterns).length}-stance data`);
                
                // Replace the monster with enhanced version
                const enhanced = { ...enhancedMap[monster.name] };
                updatedCount++;
                
                return enhanced;
            }
            return monster;
        });
        
        // Create backup
        fs.writeFileSync('complete_monster_database_backup.json', 
            fs.readFileSync('complete_monster_database.json'));
        
        // Write updated database
        fs.writeFileSync('complete_monster_database.json', 
            JSON.stringify(currentDb, null, 4));
        
        console.log(`\n✅ Successfully updated ${updatedCount} monsters with enhanced multi-stance data`);
        console.log(`📊 Updated monsters now support 3-5 dynamic stances each`);
        console.log(`💾 Backup saved as complete_monster_database_backup.json`);
        
        // Analyze stance patterns in updated database
        analyzeStancePatterns(currentDb);
        
    } catch (error) {
        console.error('❌ Error merging enhanced monsters:', error);
        return false;
    }
    
    return true;
}

function analyzeStancePatterns(database) {
    console.log('\n📋 STANCE PATTERN ANALYSIS:');
    console.log('================================');
    
    const stanceStats = {};
    let complexMonsters = [];
    
    database.monsters.forEach(monster => {
        if (monster.stance_patterns) {
            const stanceCount = Object.keys(monster.stance_patterns).length;
            
            if (!stanceStats[stanceCount]) {
                stanceStats[stanceCount] = [];
            }
            stanceStats[stanceCount].push(monster.name);
            
            if (stanceCount >= 3) {
                complexMonsters.push({
                    name: monster.name,
                    stanceCount: stanceCount,
                    stances: Object.keys(monster.stance_patterns)
                });
            }
        }
    });
    
    // Display stance distribution
    Object.keys(stanceStats).sort((a, b) => parseInt(a) - parseInt(b)).forEach(count => {
        console.log(`${count} stances: ${stanceStats[count].length} monsters`);
        if (parseInt(count) >= 3) {
            stanceStats[count].forEach(name => console.log(`  - ${name}`));
        }
    });
    
    console.log(`\n🎯 COMPLEX MONSTERS (3+ stances): ${complexMonsters.length}`);
    complexMonsters.forEach(monster => {
        console.log(`📍 ${monster.name}: ${monster.stanceCount} stances (${monster.stances.join(', ')})`);
    });
    
    // Verify specific enhanced monsters
    const keyMonsters = ['Alatreon', 'Fatalis', 'Zinogre', 'Rathalos'];
    console.log('\n🔍 KEY ENHANCED MONSTERS:');
    keyMonsters.forEach(name => {
        const monster = database.monsters.find(m => m.name === name);
        if (monster && monster.stance_patterns) {
            const stances = Object.keys(monster.stance_patterns);
            console.log(`✅ ${name}: ${stances.length} stances (${stances.join(', ')})`);
        } else {
            console.log(`❌ ${name}: Not found or no stance patterns`);
        }
    });
}

// Execute if run directly
if (require.main === module) {
    mergeEnhancedMonsters();
}

module.exports = { mergeEnhancedMonsters, analyzeStancePatterns };