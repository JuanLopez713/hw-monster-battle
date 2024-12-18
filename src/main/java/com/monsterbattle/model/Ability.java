package main.java.com.monsterbattle.model;

public class Ability {
    private final String name;
    private final ElementType type;
    private final int basePower;
    private final boolean isSpecial;
    private final int energyCost;
    
    public static final int MAX_POWER = 200;
    public static final int MIN_POWER = 20;
    
    public Ability(String name, ElementType type, int basePower, boolean isSpecial) {
        // Validate power range
        if (basePower < MIN_POWER || basePower > MAX_POWER) {
            throw new IllegalArgumentException(
                String.format("Ability power must be between %d and %d (got %d)", 
                    MIN_POWER, MAX_POWER, basePower)
            );
        }
        
        // Regular moves cost 1/4 power, special moves cost 1/2 power
        this.energyCost = isSpecial ? basePower / 2 : basePower / 4;
        
        // Additional validation for regular moves (can't exceed certain power)
        if (!isSpecial && basePower > 120) {
            throw new IllegalArgumentException(
                "Regular abilities cannot exceed 120 power (would cost too much energy)"
            );
        }
        
        this.name = name;
        this.type = type;
        this.basePower = basePower;
        this.isSpecial = isSpecial;
    }
    
    // Getters
    public String getName() { return name; }
    public ElementType getType() { return type; }
    public int getBasePower() { return basePower; }
    public boolean isSpecial() { return isSpecial; }
    public int getEnergyCost() { return energyCost; }
    
    // Validation method for checking ability validity
    public static boolean isValidAbility(Ability ability) {
        if (ability == null) return false;
        
        // Check power range
        if (ability.getBasePower() < MIN_POWER || ability.getBasePower() > MAX_POWER) 
            return false;
        
        // Check energy cost ratio
        if (ability.isSpecial()) {
            return ability.getEnergyCost() == ability.getBasePower() / 2;
        } else {
            // Regular moves can't exceed 120 power (30 energy cost)
            return ability.getBasePower() <= 120 && 
                   ability.getEnergyCost() == ability.getBasePower() / 4;
        }
    }
    
    @Override
    public String toString() {
        return String.format("%s (%s type, Power: %d, Energy Cost: %d%s)", 
            name, type, basePower, energyCost,
            isSpecial ? " [Special]" : " [Regular]"
        );
    }
}