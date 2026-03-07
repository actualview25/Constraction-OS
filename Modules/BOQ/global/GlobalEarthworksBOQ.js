export class GlobalEarthworksBOQ {
    calculate(excavations, compactions) {
        let totalExcavation = 0;
        let totalCompaction = 0;
        
        excavations.forEach(ex => {
            totalExcavation += ex.totalVolume;
        });
        
        compactions.forEach(co => {
            totalCompaction += co.totalVolume;
        });

        return {
            totalExcavation: totalExcavation.toFixed(2),
            totalCompaction: totalCompaction.toFixed(2),
            netVolume: (totalExcavation - totalCompaction).toFixed(2)
        };
    }
}
