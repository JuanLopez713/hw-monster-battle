package main.java.com.monsterbattle.model;
public class StoneGuardian implements MonsterInterface {
    // Instance variables for all stats
    private final int maxHealth;
    private final int attack;
    private final int defense;
    private final int speed;
    private int currentHealth;
    private int currentEnergy;
    private final Ability regularAbility;
    private final Ability specialAbility;

    public StoneGuardian() {
        // Initialize base stats (total: 255)
        this.maxHealth = 100;
        this.attack = 45;
        this.defense = 80;
        this.speed = 30;

        // Initialize abilities
        this.regularAbility = new Ability("Rock Throw", ElementType.EARTH, 60, false);
        this.specialAbility = new Ability("Mountain Crush", ElementType.EARTH, 140, true);

        // Set current values to max
        reset();
    }

    @Override
    public String getName() {
        return "Stone Guardian";
    }

    @Override
    public ElementType getType() {
        return ElementType.EARTH;
    }

    @Override
    public int getMaxHealth() {
        return maxHealth;
    }

    @Override
    public int getCurrentHealth() {
        return currentHealth;
    }

    @Override
    public int getAttack() {
        return attack;
    }

    @Override
    public int getDefense() {
        return defense;
    }

    @Override
    public int getSpeed() {
        return speed;
    }

    @Override
    public int getCurrentEnergy() {
        return currentEnergy;
    }

    @Override
    public int getMaxEnergy() {
        return 100;
    }

    @Override
    public Ability getRegularAbility() {
        return regularAbility;
    }

    @Override
    public Ability getSpecialAbility() {
        return specialAbility;
    }

    @Override
    public void takeDamage(int damage, ElementType type) {
        currentHealth = Math.max(0, currentHealth - damage);
    }

    @Override
    public void useEnergy(int amount) {
        currentEnergy = Math.max(0, currentEnergy - amount);
    }

    @Override
    public void restoreEnergy(int amount) {
        currentEnergy = Math.min(getMaxEnergy(), currentEnergy + amount);
    }

    @Override
    public void reset() {
        currentHealth = maxHealth;
        currentEnergy = getMaxEnergy();
    }

    @Override
    public boolean isAlive() {
        return currentHealth > 0;
    }
}