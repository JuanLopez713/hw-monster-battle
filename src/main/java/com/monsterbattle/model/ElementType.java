package main.java.com.monsterbattle.model;

public enum ElementType {
    FIRE, WATER, EARTH, AIR, LIGHT, DARK;
    
    public double getEffectivenessAgainst(ElementType defenderType) {
        switch (this) {
            case FIRE:
                return defenderType == EARTH ? 1.5 :
                       defenderType == WATER ? 0.5 : 1.0;
            case WATER:
                return defenderType == FIRE ? 1.5 :
                       defenderType == EARTH ? 0.5 : 1.0;
            case EARTH:
                return defenderType == AIR ? 1.5 :
                       defenderType == FIRE ? 0.5 : 1.0;
            case AIR:
                return defenderType == WATER ? 1.5 :
                       defenderType == EARTH ? 0.5 : 1.0;
            case LIGHT:
                return defenderType == DARK ? 1.5 :
                       defenderType == EARTH ? 0.5 : 1.0;
            case DARK:
                return defenderType == LIGHT ? 1.5 :
                       defenderType == AIR ? 0.5 : 1.0;
            default:
                return 1.0;
        }
    }
}