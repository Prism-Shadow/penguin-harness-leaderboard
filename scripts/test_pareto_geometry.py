"""Offline regression tests for the chart's label connector geometry."""

import json
from pathlib import Path
import subprocess
import unittest


class ParetoGeometryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        source = (Path(__file__).resolve().parents[1] / "site/script.js").read_text()
        cls.geometry = source[
            source.index("function segmentCrossesBox("):
            source.index("// Resolve close points")
        ]
        cls.geometry += "\n" + "\n".join(
            line for line in source.splitlines() if line.startswith("const PARETO_COST_")
        )
        cls.geometry += "\n" + source[
            source.index("function paretoRows("):source.index("function paretoConfigLabel(")
        ]

    def test_cost_viewport_includes_boundaries_not_missing_or_out_of_range(self):
        self.assertEqual(self.evaluate("""(() => {
            const costs=[0,1199.99,1200,1200.01,2059.19,null,undefined,-1,Infinity,'30'];
            globalThis.filteredRows=()=>costs.map((cost,i)=>({
                id:i,source_type:'benchmark_official',total_cost_usd:cost
            }));
            return paretoRows().map(row=>row.id);
        })()"""), [0, 1, 2])

    def test_chart_range_does_not_delete_or_mutate_table_records(self):
        self.assertEqual(self.evaluate("""(() => {
            const rows=[
                {id:'in',source_type:'penguin_run',total_cost_usd:29.48},
                {id:'outside',source_type:'benchmark_official',total_cost_usd:2059.19},
                {id:'vendor',source_type:'vendor_reported',total_cost_usd:25},
                {id:'missing',source_type:'benchmark_official',total_cost_usd:null}
            ];
            globalThis.filteredRows=()=>rows;
            const before=JSON.stringify(rows),chart=paretoRows();
            return {chart:chart.map(row=>row.id),table:rows.length,unchanged:JSON.stringify(rows)===before};
        })()"""), {"chart": ["in"], "table": 4, "unchanged": True})

    def evaluate(self, expression):
        result = subprocess.run(
            ["node", "-e", self.geometry + "\nconsole.log(JSON.stringify(" + expression + "));"],
            capture_output=True, text=True, check=True, timeout=10,
        )
        return json.loads(result.stdout)

    def test_straight_route_without_obstacles(self):
        self.assertEqual(self.evaluate(
            "routeParetoLeader({x:0,y:0},{x:100,y:0},[])"
        ), [{"x": 0, "y": 0}, {"x": 100, "y": 0}])

    def test_connector_routes_around_labels(self):
        for boxes in (
            [{"x": 30, "y": -10, "width": 20, "height": 20}],
            [
                {"x": 20, "y": -30, "width": 30, "height": 40},
                {"x": 40, "y": -10, "width": 30, "height": 40},
            ],
        ):
            with self.subTest(boxes=boxes):
                result = self.evaluate("""(() => {
                    const boxes = %s;
                    const route = routeParetoLeader({x:0,y:0},{x:100,y:0},boxes);
                    return {route, clear: route.slice(1).every((end,i) =>
                        boxes.every(box => !segmentCrossesBox(route[i],end,box)))};
                })()""" % json.dumps(boxes))
                self.assertGreater(len(result["route"]), 2)
                self.assertTrue(result["clear"])
                self.assertEqual(result["route"][0], {"x": 0, "y": 0})
                self.assertEqual(result["route"][-1], {"x": 100, "y": 0})

    def test_unreachable_endpoint_never_draws_through_text(self):
        self.assertEqual(self.evaluate(
            "routeParetoLeader({x:0,y:0},{x:40,y:0},[{x:30,y:-10,width:20,height:20}])"
        ), [])

    def test_segment_touching_text_counts_as_collision(self):
        self.assertTrue(self.evaluate(
            "segmentCrossesBox({x:0,y:0},{x:100,y:0},{x:30,y:0,width:20,height:10})"
        ))

    def test_disjoint_collinear_segment_is_clear(self):
        self.assertFalse(self.evaluate(
            "segmentCrossesBox({x:0,y:0},{x:10,y:0},{x:30,y:0,width:20,height:10})"
        ))

    def test_vertical_and_zero_length_segments(self):
        self.assertEqual(self.evaluate("""[
            segmentCrossesBox({x:40,y:-20},{x:40,y:20},{x:30,y:-10,width:20,height:20}),
            segmentCrossesBox({x:40,y:0},{x:40,y:0},{x:30,y:-10,width:20,height:20}),
            segmentCrossesBox({x:0,y:0},{x:0,y:0},{x:30,y:-10,width:20,height:20})
        ]"""), [True, True, False])

    def test_neighbor_labels_reposition_together(self):
        result = self.evaluate("""(() => {
            const box = (x, cost) => ({x,y:20,width:20,top:14,bottom:4,cost});
            const jobs = [
                {choices:[box(0,1),box(40,4)],fallback:box(200,1e8)},
                {choices:[box(0,1),box(100,100)],fallback:box(240,1e8)}
            ];
            const positions=layoutParetoLabels(jobs);
            return positions.map(p=>p.x);
        })()""")
        self.assertEqual(result, [40, 0])

    def test_layout_is_deterministic_and_retains_unplaceable_names(self):
        self.assertEqual(self.evaluate("""(() => {
            const p={x:0,y:20,width:20,top:14,bottom:4,cost:1};
            const jobs=[{choices:[p],fallback:{...p,y:80,cost:1e8}},
                {choices:[],fallback:{...p,y:120,cost:1e8}}];
            const first=layoutParetoLabels(jobs),second=layoutParetoLabels(jobs);
            return {count:first.length,same:JSON.stringify(first)===JSON.stringify(second),y:first[1].y};
        })()"""), {"count": 2, "same": True, "y": 120})

    def test_other_labels_do_not_push_nearby_penguin_away(self):
        self.assertEqual(self.evaluate("""(() => {
            const box=(x,cost)=>({x,y:20,width:20,top:14,bottom:4,cost});
            const jobs=[
                {choices:[box(0,1),box(40,4)],preserveProximity:true,fallback:box(200,1e8)},
                {choices:[box(0,1),box(100,100)],fallback:box(240,1e8)}
            ];
            return layoutParetoLabels(jobs).map(p=>p.x);
        })()"""), [0, 100])


if __name__ == "__main__":
    unittest.main()
