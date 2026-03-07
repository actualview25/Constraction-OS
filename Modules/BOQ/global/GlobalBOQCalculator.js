// =======================================
// ACTUAL CONSTRUCTION OS - GLOBAL BOQ CALCULATOR
// =======================================

export class GlobalBOQCalculator {
    constructor(globalSystem) {
        this.globalSystem = globalSystem;
        this.results = {
            architecture: {},
            concrete: {},
            earthworks: {},
            mep: {}
        };
    }

    calculateAll() {
        this.calculateArchitecture();
        this.calculateConcrete();
        this.calculateEarthworks();
        this.calculateMEP();
        
        return this.getSummary();
    }

    calculateArchitecture() {
        const walls = [];
        const floors = [];
        
        this.globalSystem.entities.forEach(entity => {
            if (entity.type === 'wall') {
                walls.push(entity);
            } else if (entity.type === 'floor') {
                floors.push(entity);
            }
        });

        this.results.architecture = {
            walls: this.summarizeWalls(walls),
            floors: this.summarizeFloors(floors)
        };
    }

    summarizeWalls(walls) {
        let totalLength = 0;
        let totalVolume = 0;
        let totalArea = 0;
        
        walls.forEach(wall => {
            totalLength += wall.totalProperties?.length || 0;
            totalVolume += wall.totalProperties?.volume || 0;
            totalArea += wall.totalProperties?.area || 0;
        });

        return {
            count: walls.length,
            totalLength: totalLength.toFixed(2),
            totalVolume: totalVolume.toFixed(2),
            totalArea: totalArea.toFixed(2),
            byMaterial: this.groupByMaterial(walls)
        };
    }

    summarizeFloors(floors) {
        let totalArea = 0;
        let totalVolume = 0;
        
        floors.forEach(floor => {
            totalArea += floor.totalProperties?.area || 0;
            totalVolume += floor.totalProperties?.volume || 0;
        });

        return {
            count: floors.length,
            totalArea: totalArea.toFixed(2),
            totalVolume: totalVolume.toFixed(2)
        };
    }

    calculateConcrete() {
        const beams = [];
        const columns = [];
        const slabs = [];
        const foundations = [];
        
        this.globalSystem.entities.forEach(entity => {
            if (entity.type === 'beam') beams.push(entity);
            else if (entity.type === 'column') columns.push(entity);
            else if (entity.type === 'slab') slabs.push(entity);
            else if (entity.type === 'foundation') foundations.push(entity);
        });

        this.results.concrete = {
            beams: this.summarizeBeams(beams),
            columns: this.summarizeColumns(columns),
            slabs: this.summarizeSlabs(slabs),
            foundations: this.summarizeFoundations(foundations),
            totals: this.calculateConcreteTotals(beams, columns, slabs, foundations)
        };
    }

    summarizeBeams(beams) {
        let totalLength = 0;
        let totalVolume = 0;
        let totalRebar = 0;
        
        beams.forEach(beam => {
            totalLength += beam.totalProperties?.length || 0;
            totalVolume += beam.totalProperties?.volume || 0;
            totalRebar += beam.totalProperties?.rebar || 0;
        });

        return {
            count: beams.length,
            totalLength: totalLength.toFixed(2),
            totalVolume: totalVolume.toFixed(2),
            totalRebar: totalRebar.toFixed(2)
        };
    }

    summarizeColumns(columns) {
        let totalVolume = 0;
        let totalRebar = 0;
        
        columns.forEach(column => {
            totalVolume += column.totalProperties?.volume || 0;
            totalRebar += column.totalProperties?.rebar || 0;
        });

        return {
            count: columns.length,
            totalVolume: totalVolume.toFixed(2),
            totalRebar: totalRebar.toFixed(2),
            byShape: this.groupByShape(columns)
        };
    }

    summarizeSlabs(slabs) {
        let totalArea = 0;
        let totalVolume = 0;
        let totalRebar = 0;
        
        slabs.forEach(slab => {
            totalArea += slab.totalProperties?.area || 0;
            totalVolume += slab.totalProperties?.volume || 0;
            totalRebar += slab.totalProperties?.rebar || 0;
        });

        return {
            count: slabs.length,
            totalArea: totalArea.toFixed(2),
            totalVolume: totalVolume.toFixed(2),
            totalRebar: totalRebar.toFixed(2)
        };
    }

    summarizeFoundations(foundations) {
        // مشابه للأعمدة
        return {
            count: foundations.length
        };
    }

    calculateConcreteTotals(beams, columns, slabs, foundations) {
        let totalVolume = 0;
        let totalRebar = 0;
        
        [...beams, ...columns, ...slabs, ...foundations].forEach(item => {
            totalVolume += item.totalProperties?.volume || 0;
            totalRebar += item.totalProperties?.rebar || 0;
        });

        return {
            totalVolume: totalVolume.toFixed(2),
            totalRebar: totalRebar.toFixed(2)
        };
    }

    calculateEarthworks() {
        const excavations = [];
        const compactions = [];
        
        this.globalSystem.entities.forEach(entity => {
            if (entity.type === 'excavation') excavations.push(entity);
            else if (entity.type === 'compaction') compactions.push(entity);
        });

        let totalExcavation = 0;
        let totalCompaction = 0;
        
        excavations.forEach(ex => {
            totalExcavation += ex.totalProperties?.volume || 0;
        });
        
        compactions.forEach(co => {
            totalCompaction += co.totalProperties?.volume || 0;
        });

        this.results.earthworks = {
            excavations: {
                count: excavations.length,
                totalVolume: totalExcavation.toFixed(2)
            },
            compactions: {
                count: compactions.length,
                totalVolume: totalCompaction.toFixed(2)
            },
            netVolume: (totalExcavation - totalCompaction).toFixed(2)
        };
    }

    calculateMEP() {
        const electrical = [];
        const plumbing = [];
        const hvac = [];
        
        this.globalSystem.entities.forEach(entity => {
            if (entity.type === 'electrical') electrical.push(entity);
            else if (entity.type === 'plumbing') plumbing.push(entity);
            else if (entity.type === 'hvac') hvac.push(entity);
        });

        this.results.mep = {
            electrical: this.summarizeElectrical(electrical),
            plumbing: this.summarizePlumbing(plumbing),
            hvac: this.summarizeHVAC(hvac)
        };
    }

    summarizeElectrical(electrical) {
        let totalCables = 0;
        let totalPoints = 0;
        
        electrical.forEach(e => {
            totalCables += e.totalProperties?.totalCableLength || 0;
            totalPoints += e.totalProperties?.totalPoints || 0;
        });

        return {
            circuits: electrical.length,
            totalCables: totalCables.toFixed(2),
            totalPoints: totalPoints
        };
    }

    summarizePlumbing(plumbing) {
        let totalPipes = 0;
        let totalFixtures = 0;
        
        plumbing.forEach(p => {
            totalPipes += p.totalProperties?.totalPipeLength || 0;
            totalFixtures += p.totalProperties?.fixturesCount || 0;
        });

        return {
            systems: plumbing.length,
            totalPipes: totalPipes.toFixed(2),
            totalFixtures: totalFixtures
        };
    }

    summarizeHVAC(hvac) {
        let totalCapacity = 0;
        let totalDucts = 0;
        
        hvac.forEach(h => {
            totalCapacity += h.totalProperties?.totalCapacity || 0;
            totalDucts += h.totalProperties?.totalDuctLength || 0;
        });

        return {
            systems: hvac.length,
            totalCapacity: totalCapacity,
            totalDucts: totalDucts.toFixed(2)
        };
    }

    groupByMaterial(elements) {
        const groups = {};
        elements.forEach(element => {
            const material = element.data?.material || 'unknown';
            if (!groups[material]) {
                groups[material] = {
                    count: 0,
                    volume: 0
                };
            }
            groups[material].count++;
            groups[material].volume += element.totalProperties?.volume || 0;
        });
        return groups;
    }

    groupByShape(columns) {
        const groups = {};
        columns.forEach(col => {
            const shape = col.data?.shape || 'rectangular';
            if (!groups[shape]) {
                groups[shape] = {
                    count: 0,
                    volume: 0
                };
            }
            groups[shape].count++;
            groups[shape].volume += col.totalProperties?.volume || 0;
        });
        return groups;
    }

    getSummary() {
        return {
            architecture: this.results.architecture,
            concrete: this.results.concrete,
            earthworks: this.results.earthworks,
            mep: this.results.mep,
            grandTotals: this.calculateGrandTotals()
        };
    }

    calculateGrandTotals() {
        let totalVolume = 0;
        let totalRebar = 0;
        
        // جمع من الخرسانة
        if (this.results.concrete.totals) {
            totalVolume += parseFloat(this.results.concrete.totals.totalVolume) || 0;
            totalRebar += parseFloat(this.results.concrete.totals.totalRebar) || 0;
        }
        
        // جمع من العمارة
        if (this.results.architecture.walls) {
            totalVolume += parseFloat(this.results.architecture.walls.totalVolume) || 0;
        }
        
        return {
            totalConcreteVolume: totalVolume.toFixed(2),
            totalRebarWeight: totalRebar.toFixed(2),
            totalElements: this.countAllElements()
        };
    }

    countAllElements() {
        let count = 0;
        this.globalSystem.entities.forEach(() => count++);
        return count;
    }
}
