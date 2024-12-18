package main.java.com.monsterbattle.examples;

import main.java.com.monsterbattle.model.Ability;
import main.java.com.monsterbattle.model.ElementType;

public class AbilityExamples {
    // Regular abilities (1/4 energy cost)
    public static final Ability QUICK_STRIKE = 
        new Ability("Quick Strike", ElementType.AIR, 40, false);  
        // Power 40, Cost 10
        
    public static final Ability FLAME_BURST = 
        new Ability("Flame Burst", ElementType.FIRE, 80, false);  
        // Power 80, Cost 20
        
    public static final Ability HEAVY_SLAM = 
        new Ability("Heavy Slam", ElementType.EARTH, 120, false);  
        // Power 120, Cost 30 (maximum for regular moves)
    
    // Special abilities (1/2 energy cost)
    public static final Ability POWER_BLAST = 
        new Ability("Power Blast", ElementType.AIR, 100, true);  
        // Power 100, Cost 50
        
    public static final Ability HYDRO_CANNON = 
        new Ability("Hydro Cannon", ElementType.WATER, 160, true);  
        // Power 160, Cost 80
        
    public static final Ability ULTIMATE_BEAM = 
        new Ability("Ultimate Beam", ElementType.LIGHT, 200, true);  
        // Power 200, Cost 100
    
    public static void main(String[] args) {
        // Print example moves and their costs
        System.out.println("Regular Moves:");
        System.out.println(QUICK_STRIKE);
        System.out.println(FLAME_BURST);
        System.out.println(HEAVY_SLAM);
        
        System.out.println("\nSpecial Moves:");
        System.out.println(POWER_BLAST);
        System.out.println(HYDRO_CANNON);
        System.out.println(ULTIMATE_BEAM);
        
        // Example power/energy ratios
        System.out.println("\nPower to Energy Cost Examples:");
        System.out.println("Regular moves (1/4 ratio):");
        System.out.println("40 power = " + (40/4) + " energy");
        System.out.println("80 power = " + (80/4) + " energy");
        System.out.println("120 power = " + (120/4) + " energy (maximum)");
        
        System.out.println("\nSpecial moves (1/2 ratio):");
        System.out.println("100 power = " + (100/2) + " energy");
        System.out.println("160 power = " + (160/2) + " energy");
        System.out.println("200 power = " + (200/2) + " energy");
    }
}