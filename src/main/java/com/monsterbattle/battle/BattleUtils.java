package main.java.com.monsterbattle.battle;

import main.java.com.monsterbattle.model.MonsterInterface;
import main.java.com.monsterbattle.model.Ability;

public class BattleUtils {
    public static final double STAB_MULTIPLIER = 1.5;
    public static final double CRITICAL_MULTIPLIER = 2.0;
    
    /**
     * Calculate critical hit chance based on speed difference
     */
    public static double calculateCriticalChance(int attackerSpeed, int defenderSpeed) {
        double baseChance = 0.05;
        int speedDiff = attackerSpeed - defenderSpeed;
        double speedBonus = Math.max(0, Math.min(0.25, speedDiff / 100.0));
        return baseChance + speedBonus;
    }
    
    /**
     * Calculate total damage including STAB, type effectiveness, and critical hits
     */
    public static int calculateDamage(MonsterInterface attacker, MonsterInterface defender, Ability ability) {
        // Check for critical hit
        double critChance = calculateCriticalChance(attacker.getSpeed(), defender.getSpeed());
        boolean isCritical = Math.random() < critChance;
        
        // Calculate multipliers
        double stab = (attacker.getType() == ability.getType()) ? STAB_MULTIPLIER : 1.0;
        double typeEffectiveness = ability.getType().getEffectivenessAgainst(defender.getType());
        double critMultiplier = isCritical ? CRITICAL_MULTIPLIER : 1.0;
        
        // Base damage calculation
        int baseDamage = (attacker.getAttack() * ability.getBasePower()) / 100;
        
        // Apply multipliers
        double totalMultiplier = stab * typeEffectiveness * critMultiplier;
        int finalDamage = (int)(baseDamage * totalMultiplier);
        
        // Apply defense reduction (reduced effect on critical hits)
        int defenseValue = isCritical ? defender.getDefense() / 4 : defender.getDefense() / 2;
        finalDamage = Math.max(1, finalDamage - defenseValue);
        
        return finalDamage;
    }
    
    /**
     * Calculate energy gain for a turn
     */
    public static int calculateTurnEnergyGain(MonsterInterface monster, boolean hitCritical) {
        int energyGain = 20; // Base energy gain per turn
        if (hitCritical) {
            energyGain += 10; // Bonus energy for critical hits
        }
        return Math.min(100 - monster.getCurrentEnergy(), energyGain);
    }
}