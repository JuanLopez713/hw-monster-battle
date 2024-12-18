package main.java.com.monsterbattle.model;

import main.java.com.monsterbattle.battle.BattleUtils;

public interface MonsterInterface {
    /**
     * @return The name of the monster
     */
    String getName();
    
    /**
     * @return The monster's primary element type
     */
    ElementType getType();
    
    /**
     * Stat getters (total of all stats must equal 255)
     */
    int getMaxHealth();    // Current total health capacity
    int getCurrentHealth(); // Current health points
    int getAttack();       // Attack stat
    int getDefense();      // Defense stat
    int getSpeed();        // Speed stat (affects critical hit chance)
    
    /**
     * Energy management
     */
    int getCurrentEnergy(); // Current energy points
    int getMaxEnergy();    // Maximum energy (fixed at 100)
    void useEnergy(int amount);
    void restoreEnergy(int amount);
    
    /**
     * @return The monster's regular ability (costs 1/4 of power in energy)
     */
    Ability getRegularAbility();
    
    /**
     * @return The monster's special ability (costs 1/2 of power in energy)
     */
    Ability getSpecialAbility();
    
    /**
     * Called when the monster takes damage
     * @param damage Amount of damage taken
     * @param type Element type of the attack
     */
    void takeDamage(int damage, ElementType type);
    
    /**
     * Called at the start of battle
     * Resets health and energy to maximum
     */
    void reset();
    
    /**
     * @return true if health > 0
     */
    boolean isAlive();
    
    /**
     * Use an ability against a target monster
     * @param ability The ability to use
     * @param target The target monster
     * @return true if the ability was used successfully
     */
    default boolean useAbility(Ability ability, MonsterInterface target) {
        // Check if we have enough energy
        if (getCurrentEnergy() < ability.getEnergyCost()) {
            return false;
        }
        
        // Calculate and deal damage
        int damage = BattleUtils.calculateDamage(this, target, ability);
        target.takeDamage(damage, ability.getType());
        
        // Use energy
        useEnergy(ability.getEnergyCost());
        
        return true;
    }
    
    /**
     * Validate that stat distribution equals 255
     * @return true if valid
     */
    default boolean validateStats() {
        return getMaxHealth() + getAttack() + getDefense() + getSpeed() == 255;
    }
}